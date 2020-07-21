in vec3 starPositions;
in vec3 starVelocities;
in float dist;
in float pmra;
in float pmdec;
in float distMod;
in float gmag;
in float rpmag;
in float bpmag;
in float w1mag;
in float w2mag;
out vec3 StarPositions;
out vec3 StarVelocities;
out float Dist;
out float pmRA;
out float pmDec;
out float DistMod;
out float GMag;
out float RpMag;
out float BpMag;
out float W1Mag;
out float W2Mag;
void main(void)
{
	StarPositions=starPositions;
	StarVelocities=starVelocities;
	Dist=dist;
	pmRA=pmra;
	pmDec=pmdec;
	DistMod=distMod;
	GMag=gmag;
	RpMag=rpmag;
	BpMag=bpmag;
	W1Mag=w1mag;
	W2Mag=w2mag;
    gl_Position = vec4(starPositions,1.0);
}

