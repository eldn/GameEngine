#pragma glslify: import('./chunk/extensions.frag');
#pragma glslify: import('./chunk/baseDefine.glsl');
#pragma glslify: import('./chunk/precision.frag');

#pragma glslify: import('./chunk/color.frag');
#pragma glslify: import('./chunk/uv.frag');
#pragma glslify: import('./chunk/normal.frag');
#pragma glslify: import('./chunk/lightFog.frag');
#pragma glslify: import('./chunk/pbr.frag');
#pragma glslify: import('./chunk/light.frag');
#pragma glslify: import('./chunk/transparency.frag');
#pragma glslify: import('./chunk/fog.frag');
#pragma glslify: import('./chunk/logDepth.frag');

void main(void) {
    vec4 color = vec4(0., 0., 0., 1.);

    #pragma glslify: import('./chunk/normal_main.frag');
    #pragma glslify: import('./chunk/lightFog_main.frag');
    #pragma glslify: import('./chunk/pbr_main.frag');
    #pragma glslify: import('./chunk/frag_color.frag');
    #pragma glslify: import('./chunk/logDepth_main.frag');
}