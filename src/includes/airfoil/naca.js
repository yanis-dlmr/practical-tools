class NACA {

    constructor(naca_type, naca_digits, naca_chord) {
        this.naca_type = naca_type;
        this.naca_digits = naca_digits;
        this.naca_chord = naca_chord;

        this.naca_m = naca_digits[0] / 100;
        this.naca_p = naca_digits[1] / 10;
        this.naca_t = ( naca_digits[2] + naca_digits[3] ) / 100;

        console.table({
            naca_m: this.naca_m, 
            naca_p: this.naca_p, 
            naca_t: this.naca_t
        });

        this.x = [];
        this.yt = [];
        this.yc = [];

        this.theta = [];
        this.theta_rounded = [];
        this.yc_theta = [];
        this.dyc_dx_theta = [];

        this.xu = [];
        this.yu = [];
        this.xl = [];
        this.yl = [];

        this.lift_coefficients = [];
        
        this.generate_naca_profile();

        this.compute_lift_coefficient();
    }

    generate_naca_profile() {
        // Generate x range from 0 to chord with 100 points
        this.x = Array.from(Array(100).keys()).map(x => x * this.naca_chord / 100);

        // Generate yc (camber line)
        const x_origin = this.naca_chord / 2;
        for (let i = 0; i < this.x.length; i++) {            

            if (this.x[i] <= this.naca_p * this.naca_chord) {
                this.yc[i] = this.naca_m * this.x[i] / Math.pow(this.naca_p, 2) * (2 * this.naca_p - this.x[i] / this.naca_chord);
                console.log(this.yc[i]);
                if (this.yc[i] == NaN) {
                    console.log("NAN");
                    this.yc[i] = 0;
                }
                this.dyc_dx_theta[i] = 2 * this.naca_m / Math.pow(this.naca_p, 2) * (this.naca_p - this.x[i] / this.naca_chord);
            } else {
                this.yc[i] = this.naca_m * (this.naca_chord - this.x[i]) / Math.pow(1 - this.naca_p, 2) * (1 + this.x[i] / this.naca_chord - 2 * this.naca_p);
                this.dyc_dx_theta[i] = 2 * this.naca_m / Math.pow(1 - this.naca_p, 2) * (this.naca_p - this.x[i] / this.naca_chord);
            }

            let x_0 = this.x[i];
            let y = this.yc[i];
            let x = x_0 - x_origin;
            if (x > 0) {
                this.theta[i] = Math.atan(y / x);
            } else if (x < 0) {
                this.theta[i] = Math.atan(y / x) + Math.PI;
            } else {
                this.theta[i] = Math.PI / 2;
            }

            this.yc_theta[i] = this.yc[i] / Math.sin(this.theta[i]);
            this.theta[i] = this.theta[i] * 180 / Math.PI;
            this.theta_rounded[i] = Math.round(this.theta[i] * 100) / 100;

            // Generate yt
            this.yt[i] = this.naca_t/0.2 * (0.2969 * Math.sqrt(this.x[i]/this.naca_chord) - 0.1260 * (this.x[i]/this.naca_chord) - 0.3516 * Math.pow(this.x[i]/this.naca_chord, 2) + 0.2843 * Math.pow(this.x[i]/this.naca_chord, 3) - 0.1015 * Math.pow(this.x[i]/this.naca_chord, 4));

            // Generate xu, yu, xl, yl
            let theta
            if (this.x[i] <= this.naca_p * this.naca_chord) {
                theta = Math.atan(2 * this.naca_m / Math.pow(this.naca_p, 2) * (this.naca_p - this.x[i] / this.naca_chord));
            } else {
                theta = Math.atan(2 * this.naca_m / Math.pow(1 - this.naca_p, 2) * (this.naca_p - this.x[i] / this.naca_chord));
            }
            this.xu[i] = this.x[i] - this.yt[i] * Math.sin(theta);
            this.yu[i] = this.yc[i] + this.yt[i] * Math.cos(theta);
            this.xl[i] = this.x[i] + this.yt[i] * Math.sin(theta);
            this.yl[i] = this.yc[i] - this.yt[i] * Math.cos(theta);
        }
    }

    compute_lift_coefficient() {

        // alpha - A0
        let alpha0;
        let A1;
        let A2;

        // alpha - A0 = 1/pi * integral(0, pi, dz/dx(theta) dtheta)
        let integral = 0;
        for (let i = 1; i <= this.theta.length - 2; i++) {
            let angle_1 = this.theta[i];
            let theta_1 = angle_1 * Math.PI / 180;
            let angle_2 = this.theta[i+1];
            let theta_2 = angle_2 * Math.PI / 180;
            let delta_theta = theta_2 - theta_1;
            let avg_dz_dx = (this.dyc_dx_theta[i+1] + this.dyc_dx_theta[i]) / 2;
            integral += avg_dz_dx * delta_theta;
        }
        alpha0 = integral / Math.PI;

        // A1 = 2/pi * integral(0, pi, dz/dx(theta) * cos(theta) dtheta)
        integral = 0;
        for (let i = 1; i <= this.theta.length - 2; i++) {
            let angle_1 = this.theta[i];
            let theta_1 = angle_1 * Math.PI / 180;
            let angle_2 = this.theta[i+1];
            let theta_2 = angle_2 * Math.PI / 180;
            let delta_theta = theta_2 - theta_1;
            let z_1 = this.dyc_dx_theta[i] * Math.cos(theta_1);
            let z_2 = this.dyc_dx_theta[i+1] * Math.cos(theta_2);
            let avg_z = (z_1 + z_2) / 2;
            integral += avg_z * delta_theta;
        }
        A1 = 2 * integral / Math.PI;

        // A2 = 2/pi * integral(0, pi, dz/dx(theta) * cos(2*theta) dtheta)
        integral = 0;
        for (let i = 1; i <= this.theta.length - 2; i++) {
            let angle_1 = this.theta[i];
            let theta_1 = angle_1 * Math.PI / 180;
            let angle_2 = this.theta[i+1];
            let theta_2 = angle_2 * Math.PI / 180;
            let delta_theta = theta_2 - theta_1;
            let dz_dx = this.dyc_dx_theta[i];
            let z_1 = dz_dx * Math.cos(2 * theta_1);
            let z_2 = dz_dx * Math.cos(2 * theta_2);
            let avg_z = (z_1 + z_2) / 2;
            integral += avg_z * delta_theta;
        }
        A2 = 2 * integral / Math.PI;

        for (let angle = -20; angle <= 20; angle += 1) {
            let _angle = angle * Math.PI / 180;
            const A0 = _angle - alpha0;
            this.lift_coefficients.push({
                "angle": angle,
                "A0": A0,
                "A1": A1,
                "A2": A2,
                "lift_coefficient": Math.PI * (2*A0 + A1),
                "cm_ab": - Math.PI / 2 * (A0 + A1 - 1/2 * A2),
                "cm_c4": Math.PI / 4 * (A2 - A1)
            });
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

    get_x_top_profile() {
        return this.xu;
    }

    get_x_bottom_profile() {
        return this.xl;
    }

    get_y_top_profile() {
        return this.yu;
    }

    get_y_bottom_profile() {
        return this.yl;
    }

    get_theta() {
        return this.theta;
    }

    get_theta_rounded() {
        return this.theta_rounded;
    }

    get_yc_theta() {
        return this.yc_theta;
    }

    get_dyc_dx_theta() {
        return this.dyc_dx_theta;
    }

    get_lift_coefficients() {
        return this.lift_coefficients;
    }

}

export { NACA };