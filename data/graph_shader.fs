uniform float uv_fade;
uniform float uv_alpha;
uniform vec4 popColor;
uniform sampler2D axes1;
uniform sampler2D axes2;
uniform sampler2D axes3;
uniform float HRmix;
uniform float diagramType;

in vec2 texCoord;
in float colorFactor;

out vec4 fragColor;

void main(void)
{	
	float howCloseLim = 0.25;
	float howClose1 = abs(HRmix-1.0);
	float howClose2 = min(abs(mod(diagramType,1.)),1.-abs(mod(diagramType,1.)));
	if (howClose1 > howCloseLim) discard;
	switch (int(round(mod(diagramType,3)))) {
		case 0: 
			fragColor = vec4(1) - texture(axes1,texCoord);
			break;
		case 1:
			fragColor = vec4(1) - texture(axes2,texCoord);
			break;
		case 2:
			fragColor = vec4(1) - texture(axes3,texCoord);
			break;
		default:
			discard;
			break;		
	}
	
	fragColor.a =  (1.-howClose1/howCloseLim)*(1.-howClose2/howCloseLim) * uv_fade * uv_alpha;
		
}
