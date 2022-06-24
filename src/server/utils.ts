function makeid(length: number): number {
	var result: string = '';
	var characters: string = '0123456789';
	var charactersLength: number = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return +result;
}

export { makeid };