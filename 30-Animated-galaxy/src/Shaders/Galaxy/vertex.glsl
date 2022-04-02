attribute float aScale;
attribute vec3 aRandom;


uniform float uSize;
uniform float uTime;
uniform float uSpeed;

varying vec3 vColor;



void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Rotate
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * uSpeed;
    angle += angleOffset;

    modelPosition.x = cos(angle) * distanceToCenter + aRandom.x;
    modelPosition.z = sin(angle) * distanceToCenter + aRandom.z;
    modelPosition.y = aRandom.y;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    /**
        Size
    */
    gl_PointSize = uSize * aScale;

    /**
        Size Attenuation
    */

    gl_PointSize *= ( 1.0 / - viewPosition.z );

    // #ifdef USE_SIZEATTENUATION

	// 	bool isPerspective = isPerspectiveMatrix( projectionMatrix );

	// 	if ( isPerspective ) gl_PointSize *= ( 1.0 / - viewPosition.z );

	// #endif

    /**
        Varying
    */

    vColor = color;
}