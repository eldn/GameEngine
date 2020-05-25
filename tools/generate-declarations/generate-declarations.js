const { spawn, execSync } = require('child_process');
const { join, extname, basename, dirname, isAbsolute } = require('path');
const { copyFileSync, existsSync, readFileSync, unlinkSync, writeFileSync, ensureDirSync } = require('fs-extra');
const ts = require('typescript');
const gift = require('tfig');

const tscExecutableName = process.platform === 'win32' ? 'tsc.cmd' : 'tsc';
const tscExecutablePath = join(__dirname, '..', '..', 'node_modules', '.bin', tscExecutableName);
const tsConfigDir = join(__dirname, '..', '..');
const tsConfigPath = join(tsConfigDir, 'tsconfig.json');
const tempTsConfigPath = join(tsConfigDir, '__tsconfig-gendecls.json');

async function generate (options) {
    const tsConfig = ts.readConfigFile(tsConfigPath, (path) => readFileSync(path).toString());
    if (tsConfig.error) {
        console.error(`Bad tsconfig.json: ${tsConfig.error.messageText}`);
        return undefined;
    }

    const { outDir } = options;
    ensureDirSync(outDir);

    tsConfig.config.compilerOptions.declaration = true;
    tsConfig.config.compilerOptions.emitDeclarationOnly = true;
    tsConfig.config.compilerOptions.outFile = join(outDir, `index.js`);

    const outputJSPath = join(tsConfigDir, tsConfig.config.compilerOptions.outFile);
    // console.log(outputJSPath);

    const extName = extname(outputJSPath);
    if (extName !== '.js') {
        console.error(`Unexpected output extension ${extName}, please check it.`);
        return undefined;
    }
    const dirName = dirname(outputJSPath);
    const baseName = basename(outputJSPath, extName);
    const destExtensions = [
        '.d.ts',
        '.d.ts.map',
    ];
    for (const destExtension of destExtensions) {
        const destFile = join(dirName, baseName + destExtension);
        if (existsSync(destFile)) {
            console.log(`Delete old ${destFile}.`);
            unlinkSync(destFile);
        }
    }

    console.log(`Make temp config file ${tempTsConfigPath}.`);

    writeFileSync(tempTsConfigPath, JSON.stringify(tsConfig.config, undefined, 4));

    console.log(`Generating...`);

    await new Promise((resolve) => {
        const tscProcess = spawn(tscExecutablePath, [
            '--version',
        ]);
        tscProcess.on('exit', (code) => {
            resolve(code);
        });
        tscProcess.stdout.on('data', (data) => {
            console.log(`Typescript version: ${data.toString()}`);
        });
        tscProcess.stderr.on('data', (data) => {
            console.error(data.toString());
        });
    });

    const tscExitCode = await new Promise((resolve) => {
        const tscProcess = spawn(tscExecutablePath, [
            '-p',
            tempTsConfigPath,
        ], {
            cwd: process.cwd(),
            env: process.env,
        });
        tscProcess.on('exit', (code) => {
            resolve(code);
        });
        tscProcess.stdout.on('data', (data) => {
            console.log(data.toString());
        });
        tscProcess.stderr.on('data', (data) => {
            console.error(data.toString());
        });
    });

    console.log(`Delete temp config file ${tempTsConfigPath}.`);

    unlinkSync(tempTsConfigPath);

    if (tscExitCode !== 0) {
        console.warn(`tsc exited with non-zero status code ${tscExitCode}.`);
    }

    const tscOutputDtsFile = join(dirName, baseName + '.d.ts');
    if (!existsSync(tscOutputDtsFile)) {
        console.error(`Failed to compile.`);
        return false;
    }

    // const types = tsConfig.config.compilerOptions.types.map((typeFile) => `${typeFile}.d.ts`);
    // types.forEach((file) => {
    //     const destPath = join(outDir, isAbsolute(file) ? basename(file) : file);
    //     ensureDirSync(dirname(destPath));
    //     copyFileSync(file, destPath);
    // });

    console.log(`Bundling...`);
    const giftInputPath = tscOutputDtsFile;
    const giftOutputPath = join(dirName,'KILA.d.ts' );
    const giftResult = gift.bundle({
        verbose: true,
        input: giftInputPath,
        output: giftOutputPath,
        name: 'KILA',
        rootModule: 'index',
    });
    if (giftResult.error !== gift.GiftErrors.Ok) {
        console.error(`Failed to bundle declaration files because of gift error: ${gift.GiftErrors[giftResult.error]}.`);
        return false;
    }

    // replace " declare module "kila" " to  "  declare namespace kila " 
    giftResult.code = giftResult.code.replace("declare module \"KILA\"", "declare namespace KILA");


    writeFileSync(giftOutputPath, giftResult.code);
    unlinkSync(giftInputPath);

    

    return true;
}

module.exports = { generate };
