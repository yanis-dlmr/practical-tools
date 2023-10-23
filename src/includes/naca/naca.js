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

    get_naca_top_y(x) {
        // Get naca digits
        const naca_digits = this.get_naca_digits();
        // Get naca type
        const naca_type = this.get_naca_type();
        // Get naca chord
        const naca_chord = this.get_naca_chord();

        const naca_t = naca_digits[2,3] / 100;

        const y = naca_t/0.2 * (0.2969 * Math.sqrt(x/naca_chord) - 0.1260 * (x/naca_chord) - 0.3516 * Math.pow(x/naca_chord, 2) + 0.2843 * Math.pow(x/naca_chord, 3) - 0.1015 * Math.pow(x/naca_chord, 4));

        return y;
    }

    get_naca_top_profile() {
        // Generate x range from 0 to chord with 100 points
        const x_values = Array.from(Array(100).keys()).map(x => x * this.naca_chord / 100);
        // Generate y values
        const y_values = x_values.map(x => this.get_naca_top_y(x));
    }

}

export { NACA };