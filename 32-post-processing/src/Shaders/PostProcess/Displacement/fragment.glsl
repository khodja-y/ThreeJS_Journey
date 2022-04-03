uniform sampler2D tDiffuse;

uniform float uFrequency;
uniform float uOffset;
uniform float uTime;

uniform sampler2D uNormalMap;

varying vec2 vUv;

void main()
{
    // vec2 newUv = vec2(
    //             vUv.x,
    //             vUv.y + sin(vUv.x * uFrequency + uTime) * uOffset
    //         );
    // vec4 color = texture2D(tDiffuse, newUv);

    vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;

    vec2 newUv = vUv + normalColor.xy * 0.1;
    vec4 color = texture2D(tDiffuse, newUv);

    vec3 lightDirection = vec3(-1.0, 1.0, 0.0);
    lightDirection = normalize(lightDirection);

    float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);

    color += lightness * 0.1;

    gl_FragColor = color + lightness;
}