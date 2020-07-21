in vec3 uv_vertexAttrib;
out vec2 texCoord;
out float camDist;

uniform mat4 uv_modelViewProjectionMatrix;
uniform mat4 uv_scene2ObjectMatrix;
uniform mat4 uv_modelViewInverseMatrix;
uniform mat4 uv_modelInverseMatrix;
uniform vec4 uv_cameraPos;
uniform vec3 uv_upVec3;

float altitude = 0.;
float azimuth = 0.;
vec2 imageQuadSize = 1.316*vec2((1.6*0.3),(0.3));

float imageDepth = 103.;

const float PI = 3.1415926;
const float DEG2PI = PI/180;
vec3 targetPosInObjSpace;
vec3 eyePosInObjectSpace;
vec3 imagePositionInObjSpace;
vec3 upVectorInObjSpace;

void emit(vec2 textureCoords){
	texCoord = textureCoords;
	vec3 rigSpacePosition = vec3(0);
	rigSpacePosition.xy = uv_vertexAttrib.xy*imageQuadSize;
	rigSpacePosition.z = -1;
	vec3 objectSpaceDirection = normalize((uv_modelInverseMatrix * vec4(rigSpacePosition,0)).xyz);
	vec3 objectSpacePosition = eyePosInObjectSpace + objectSpaceDirection*imageDepth;
	gl_Position = uv_modelViewProjectionMatrix*vec4(objectSpacePosition,1.);
}

void main(void)
{
   	eyePosInObjectSpace = (uv_scene2ObjectMatrix*uv_cameraPos).xyz; 
	camDist = length(eyePosInObjectSpace);
	vec2 angles = vec2(azimuth,altitude)+(imageQuadSize/2.*uv_vertexAttrib.xy);
	emit(0.5*uv_vertexAttrib.xy+vec2(0.5));	   
}