class NACA {

    constructor(naca_type, naca_digits, naca_chord) {
        this.naca_type = naca_type;
        this.naca_digits = naca_digits;
        this.naca_chord = naca_chord;
    }

    get_naca_type() {
        return this.naca_type;
    }

    get_naca_digits() {
        return this.naca_digits;
    }

    get_naca_chord() {
        return this.naca_chord;
    }

    get_naca_profile() {
        // Generate x range from 0 to chord
        const x = [...Array(this.naca_chord + 1).keys()];
        // Generate y range
        const y = x.map(x => this.get_y(x));
        // Return profile
        return [x, y];
    }

}

export { NACA };