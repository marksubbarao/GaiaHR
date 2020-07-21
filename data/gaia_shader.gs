layout(points) in;
layout(triangle_strip, max_vertices = 4) out;

uniform mat4 uv_modelViewProjectionMatrix;
uniform mat4 uv_modelViewMatrix;
uniform mat4 uv_modelInverseMatrix;
uniform mat4 uv_projectionMatrix;
uniform mat4 uv_projectionInverseMatrix;
uniform mat4 uv_modelViewInverseMatrix;
uniform vec4 uv_cameraPos;
uniform mat4 uv_scene2ObjectMatrix;

uniform int uv_simulationtimeDays;
uniform float uv_simulationtimeSeconds;
uniform float uv_fade;
uniform float decayLength;
uniform vec2 energyLimits;


uniform float starSize;
uniform float HRmix;
uniform float diagramType;

in vec3 StarPositions[];
in vec3 StarVelocities[];
in float DistMod[];
in float Dist[];
in float GMag[];
in float RpMag[];
in float BpMag[];
in float pmRA[];
in float pmDec[];
in float W1Mag[];
in float W2Mag[];

out vec2 texcoord;
out float gmr;

vec3 targetPosInObjSpace;
vec3 eyePosInObjectSpace;
vec3 imagePositionInObjSpace;
vec3 upVectorInObjSpace;

const float PI = 3.1415926535897932384626433;
const float DEG2RAD = PI / 180.0;

mat4 getRotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}


void drawSprite(vec4 position, float radius, float rotation)
{
    vec3 objectSpaceUp = vec3(0, 0, 1);
    vec3 objectSpaceCamera = (uv_modelViewInverseMatrix * vec4(0, 0, 0, 1)).xyz;
    vec3 cameraDirection = normalize(objectSpaceCamera - position.xyz);
    vec3 orthogonalUp = normalize(objectSpaceUp - cameraDirection * dot(cameraDirection, objectSpaceUp));
    vec3 rotatedUp = mat3(getRotationMatrix(cameraDirection, rotation)) * orthogonalUp;
    vec3 side = cross(rotatedUp, cameraDirection);
	side *= sign(dot(cameraDirection,position.xyz));
    texcoord = vec2(-1., 1.);
	gl_Position = uv_modelViewProjectionMatrix * vec4(position.xyz + radius * (-side + rotatedUp), 1);
	EmitVertex();
    texcoord = vec2(-1., -1.);
	gl_Position = uv_modelViewProjectionMatrix * vec4(position.xyz + radius * (-side - rotatedUp), 1);
	EmitVertex();
    texcoord = vec2(1, 1);
	gl_Position = uv_modelViewProjectionMatrix * vec4(position.xyz + radius * (side + rotatedUp), 1);
	EmitVertex();
    texcoord = vec2(1, -1.);
	gl_Position = uv_modelViewProjectionMatrix * vec4(position.xyz + radius * (side - rotatedUp), 1);
	EmitVertex();
	EndPrimitive();
}

void main()
{	
	float timeFactor = 0.001*(uv_simulationtimeDays - 18265.5)/365.25;
	float imageDepth = 50.;
	vec2 graphCoords;
	float graphSize = 0.3;
	float graphAspectRatio = 1.6;
	float graphDither = 1.0*(mod(StarPositions[0].x,1.));
	vec3 graphRangeX = vec3(3.,12.,7.);
	vec3 graphRangeY = vec3(24.,24.,16.);	
	vec3 graphCenterX = vec3(1.0,3.,1.5);
	vec3 graphCenterY = vec3(12.0,12.0,10.0);
	vec3 position1 = StarPositions[0] + timeFactor*StarVelocities[0];
   	eyePosInObjectSpace = (uv_scene2ObjectMatrix*uv_cameraPos).xyz; 
	vec2 graphCoords1 = vec2(graphAspectRatio*(GMag[0]-RpMag[0] - graphCenterX[0]),(GMag[0] -DistMod[0]- graphCenterY[0])) * vec2(2./graphRangeX[0],-2./graphRangeY[0]);
	vec2 graphCoords2 = vec2(graphAspectRatio*(GMag[0]-W2Mag[0] - graphCenterX[1]),(W2Mag[0] -DistMod[0]- graphCenterY[1])) * vec2(2./graphRangeX[1],-2./graphRangeY[1]);
	vec2 graphCoords3 = vec2(graphAspectRatio*(W1Mag[0]-W2Mag[0] - graphCenterX[2]),(W2Mag[0] -DistMod[0]- graphCenterY[2])) * vec2(2./graphRangeX[2],-2./graphRangeY[2]);
	float graphNum = mod(diagramType,3);
	if (graphNum <= 0.0) {
		graphCoords = graphCoords1;
	} else if (graphNum < 1.0) {
		graphCoords = mix(graphCoords1,graphCoords2,graphNum);
	} else if (graphNum < 2.0) {
		graphCoords = mix(graphCoords2,graphCoords3,graphNum-1.0);
	} else {
		graphCoords = mix(graphCoords3,graphCoords1,graphNum-2.0);
	}
	vec3 objectSpaceDirection = normalize((uv_modelInverseMatrix * (vec4(0.,0.,-1.,0)+vec4(graphCoords*graphSize,0,0))).xyz);
	vec3 objectSpacePosition = eyePosInObjectSpace + (objectSpaceDirection)*(imageDepth+graphDither);
	float sSize = starSize * 0.075 * min(max((DistMod[0]-GMag[0] + 10.),3.0),100.0);
	if (GMag[0] <-100) sSize = starSize * .3;
	vec3 position = mix(position1,objectSpacePosition,HRmix);
	gmr=GMag[0]-RpMag[0];
	if (GMag[0] < -100 || RpMag[0] < -100) gmr=2.0;
	if (Dist[0] < 20.0) drawSprite(vec4(position,0.0), sSize, 0.0);
}
