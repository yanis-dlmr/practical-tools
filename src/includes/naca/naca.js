class NACA {

    constructor(naca_type, naca_digits, naca_chord) {
        this.naca_type = naca_type;
        this.naca_digits = naca_digits;
        this.naca_chord = naca_chord;

        this.x = [];
        this.yt = [];
        this.yc = [];

        this.y_up_profile = [];
        this.y_down_profile = [];
        
        this.generate_naca_profile();
    }

    generate_naca_profile() {
        // Generate x range from 0 to chord with 100 points
        this.x = Array.from(Array(100).keys()).map(x => x * this.naca_chord / 100);

        // Generate yc 
        const naca_digits = this.get_naca_digits();
        const naca_type = this.get_naca_type();
        const naca_chord = this.get_naca_chord();

        const naca_m = naca_digits[0];
        const naca_p = naca_digits[1];

        for (let i = 0; i < this.x.length; i++) {
            if (this.x[i] <= naca_p * naca_chord) {
                this.yc[i] = naca_m * this.x[i] / Math.pow(naca_p, 2) * (2 * naca_p - this.x[i] / naca_chord);
            } else {
                this.yc[i] = naca_m * (naca_chord - this.x[i]) / Math.pow(1 - naca_p, 2) * (1 + this.x[i] / naca_chord - 2 * naca_p);
            }
        }

        // Generate yt
        const naca_t = ( naca_digits[2] * 10 + naca_digits[3] ) / 100;

        for (let i = 0; i < this.x.length; i++) {
            this.yt[i] = naca_t/0.2 * (0.2969 * Math.sqrt(this.x[i]/naca_chord) - 0.1260 * (this.x[i]/naca_chord) - 0.3516 * Math.pow(this.x[i]/naca_chord, 2) + 0.2843 * Math.pow(this.x[i]/naca_chord, 3) - 0.1015 * Math.pow(this.x[i]/naca_chord, 4));
        }

        // Generate y_up_profile
        for (let i = 0; i < this.x.length; i++) {
            this.y_up_profile[i] = this.yc[i] + this.yt[i];
        }

        // Generate y_down_profile
        for (let i = 0; i < this.x.length; i++) {
            this.y_down_profile[i] = this.yc[i] - this.yt[i];
        }
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

    get_x() {
        return this.x;
    }

    get_yt() {
        return this.yt;
    }

    get_yc() {
        return this.yc;
    }

    get_y_top_profile() {
        return this.y_up_profile;
    }

    get_y_bottom_profile() {
        return this.y_down_profile;
    }

}

export { NACA };