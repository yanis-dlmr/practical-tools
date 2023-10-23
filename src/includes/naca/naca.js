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
        // Generate x range from 0 to chord with 100 points
        const x_values = Array.from(Array(100).keys()).map(x => x * this.naca_chord / 100);
        // Generate y values
        const y_values = x_values.map(x => x_values);
        return [x_values, y_values];
    }

}

export { NACA };