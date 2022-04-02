
varying vec3 vColor;


void main()
{
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = step(0.5, strength);
    // strength = 1.0 - strength;

    //StarPatten
    // vec2 strength = gl_PointCoord - vec2(0.5);

    // float pt =(1.0 - abs(strength.x * strength.y) * 1000.0);
    // float pt2 = 0.025 / length(strength);

    // float st = pt2 * pt;


    float strength = distance(gl_PointCoord, vec2(0.5));
    // strength *= 2.0;
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);


    vec3 fColor = mix(vec3(0.0), vColor, strength);

    gl_FragColor = vec4(fColor, 1.0);
}