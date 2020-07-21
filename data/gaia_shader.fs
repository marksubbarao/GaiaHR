uniform float uv_fade;
uniform float uv_alpha;
uniform vec4 popColor;
uniform sampler2D bb;

in vec2 texcoord;
in float gmr;

out vec4 fragColor;

void main(void)
{	
	float rad = length(texcoord);	
	//make a circle
	if (rad > 1.){
		discard;
	}
	vec4 starColor = texture(bb, vec2(clamp((-1.0*(gmr - 1.5)/6.0),0.,1.), 0.5));
	fragColor = starColor*(0.025 + 0.975*smoothstep(1.,0.0,rad));
	fragColor.a =  uv_fade * uv_alpha;
		
}
