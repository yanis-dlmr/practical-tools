class NACA {

    constructor(naca_type, naca_digits, naca_chord, method) {
        this.u_inf = 1;
        this.alpha = 0;

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

        if (method == 'thin_profile') {
            this.compute_lift_coefficient();
        } else if (method == 'vortex_panel_method') {
            this.compute_vortex_panel_method();
        }
    }

    generate_naca_profile() {
        // Generate x range from 0 to chord with 100 points
        //this.x = Array.from(Array(101).keys()).map(x => x * this.naca_chord / 100);

        for (let angle = 0; angle <= 180; angle += 10) {
            this.x.push(this.naca_chord / 2 * (1 + Math.cos(angle * Math.PI / 180)));
        }

        // Generate yc (camber line)
        const x_origin = this.naca_chord / 2;
        for (let i = 0; i < this.x.length; i++) {            

            if (this.x[i] <= this.naca_p * this.naca_chord) {
                this.yc[i] = this.naca_m * this.x[i] / Math.pow(this.naca_p, 2) * (2 * this.naca_p - this.x[i] / this.naca_chord);
                if (isNaN(this.yc[i])) {
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

            this.yc_theta[i] = Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));
            this.theta[i] = this.theta[i] * 180 / Math.PI;
            this.theta_rounded[i] = Math.round(this.theta[i] * 100) / 100;

            // Generate yt
            this.yt[i] = this.naca_t/0.2 * (0.2969 * Math.sqrt(this.x[i]/this.naca_chord) - 0.1260 * (this.x[i]/this.naca_chord) - 0.3516 * Math.pow(this.x[i]/this.naca_chord, 2) + 0.2843 * Math.pow(this.x[i]/this.naca_chord, 3) - 0.1015 * Math.pow(this.x[i]/this.naca_chord, 4));

            // Generate xu, yu, xl, yl
            let theta
            if (this.x[i] <= this.naca_p * this.naca_chord) {
                theta = Math.atan(2 * this.naca_m / Math.pow(this.naca_p, 2) * (this.naca_p - this.x[i] / this.naca_chord));
                if (isNaN(theta)) {
                    theta = Math.PI;
                }
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
                "cm_c4": Math.PI / 4 * (A2 - A1),
                "cd": 2 * Math.PI * (A0 + A1) * Math.sin(_angle) * Math.sin(_angle) / this.naca_chord,
            });
        }
    }

    generate_geometry() {
        let xu = [...this.xu];
        let yu = [...this.yu];
        let xl = [...this.xl];
        let yl = [...this.yl];
        let x = [...xl.reverse(), ...xu.slice(1), xl[0]];
        let y = [...yl.reverse(), ...yu.slice(1), yl[0]];

        this.x_all = x;
        this.y_all = y;
        

        let edge = [];
        for (let i = 0; i < x.length - 1; i++) {
            edge[i] = (x[i+1] - x[i]) * (y[i+1] - y[i]);
        }
        let sumEdge = 0;
        for (let i = 0; i < edge.length; i++) {
            sumEdge += edge[i];
        }

        //if (sumEdge < 0) {
        //    console.log("Points are counter-clockwise. Reversing points.");
        //    x.reverse();
        //    y.reverse();
        //} else if (sumEdge > 0) {
        //    console.log("Points are clockwise. No need to reverse.");
        //}

        console.log("x");
        console.table(x);
        console.log("y");
        console.table(y);

        // Generate XC, YC, XB, YB, S, and phi
        let XC = [];
        let YC = [];
        let XB = [];
        let YB = [];
        let S = [];
        let phi = [];
        for (let i = 0; i < x.length - 1; i++) {
            XC[i] = (x[i] + x[i+1]) / 2;
            YC[i] = (y[i] + y[i+1]) / 2;
            XB[i] = x[i];
            YB[i] = y[i];
            S[i] = Math.sqrt(Math.pow(x[i+1] - x[i], 2) + Math.pow(y[i+1] - y[i], 2));
            phi[i] = Math.atan2(y[i+1] - y[i], x[i+1] - x[i]);
            if (phi[i] < 0) {
                phi[i] += 2 * Math.PI;
            }
        }
        let delta = [];
        let beta = [];
        for (let i = 0; i < x.length - 1; i++) {
            delta[i] = phi[i] + Math.PI / 2;
            beta[i] = delta[i] - this.alpha;
            // make all beta between 0 and 2pi
            if (beta[i] < 0) {
                beta[i] += 2 * Math.PI;
            } else if (beta[i] > 2 * Math.PI) {
                beta[i] -= 2 * Math.PI;
            }
        }

        this.panels = [];
        for (let i = 0; i < x.length - 1; i++) {
            this.panels.push({
                "X0": XC[i],
                "X1": XC[i] + S[i] * Math.cos(delta[i]),
                "Y0": YC[i],
                "Y1": YC[i] + S[i] * Math.sin(delta[i]),
            });
        }

        console.table(this.panels);

        return [x, y, XC, YC, XB, YB, S, phi, delta, beta];
    }

    compute_vortex_panel_method() {

        // Generate XC, YC, XB, YB, S, and phi
        let [x, y, XC, YC, XB, YB, S, phi, delta, beta] = this.generate_geometry();

        // Generate the matrix K and L
        let num_panels = x.length - 1;

        // Initialize the matrix K and L
        let K = [];
        let L = [];
        for (let i = 0; i < num_panels; i++) {
            K[i] = [];
            L[i] = [];
            for (let j = 0; j < num_panels; j++) {
                K[i][j] = 0;
                L[i][j] = 0;
            }
        }

        // compute integral Kij and Lij
        for (let i = 0; i < num_panels; i++) {
            for (let j = 0; j < num_panels; j++) {
                if (j != i) {
                    // Compute intermediate values
                    let A  = -(XC[i]-XB[j])*Math.cos(phi[j])-(YC[i]-YB[j])*Math.sin(phi[j])
                    let B  = (XC[i]-XB[j])**2 + (YC[i]-YB[j])**2
                    let Cn = -Math.cos(phi[i]-phi[j])
                    let Dn = (XC[i]-XB[j])*Math.cos(phi[i])+(YC[i]-YB[j])*Math.sin(phi[i])
                    let Ct = Math.sin(phi[j]-phi[i])
                    let Dt = (XC[i]-XB[j])*Math.sin(phi[i])-(YC[i]-YB[j])*Math.cos(phi[i])
                    let E  = Math.sqrt(B-A**2)

                    if (E == 0 || isNaN(E)) {
                        K[i][j] = 0;
                        L[i][j] = 0;
                    } else {
                        // Compute K
                        let term1  = 0.5*Cn*Math.log((S[j]**2 + 2*A*S[j] + B)/B);
                        let term2  = ((Dn-A*Cn)/E)*(math.atan2((S[j]+A),E)-math.atan2(A,E));
                        K[i][j] = term1 + term2;

                        // Compute L
                        let term3  = 0.5*Ct*Math.log((S[j]**2 + 2*A*S[j] + B)/B)
                        let term4  = ((Dt-A*Ct)/E)*(Math.atan2((S[j]+A),E)-Math.atan2(A,E))
                        L[i][j] = term3 + term4
                    }
                }
                if (isNaN(K[i][j])) {
                    K[i][j] = 0;
                }
                if (isNaN(L[i][j])) {
                    L[i][j] = 0;
                }
            }
        }

        console.log("K")
        console.table(K);
        console.log("L")
        console.table(L);

        // Generate the matrix A and B
        let A = [];
        for (let i = 0; i < num_panels; i++) {
            A[i] = [];
            for (let j = 0; j < num_panels; j++) {
                A[i][j] = 0;
            }
        }
        let B = [];
        for (let i = 0; i < num_panels; i++) {
            B[i] = 0;
        }

        // Compute the matrix A and B
        for (let i = 0; i < num_panels; i++) {
            for (let j = 0; j < num_panels; j++) {
                if (j == i) {
                    A[i][j] = 0;
                } else {
                    A[i][j] = - K[i][j];
                }
            }
        }

        for (let i = 0; i < num_panels; i++) {
            B[i] = - this.u_inf * 2 * Math.PI * Math.cos(beta[i]);
        }

        // Satify the kutta condition
        let pos = num_panels - 1;
        for (let i = 0; i < num_panels; i++) {
            A[pos][i] = 0;
        }
        A[pos][0] = 1;
        A[pos][num_panels - 1] = 1;
        B[pos] = 0;

        console.log("A");
        console.log(A);
        this.A = A;
        console.log("A size: " + A.length + " x " + A[0].length);

        console.log("B");
        console.table(B);
        this.B = B;
        console.log("B size: " + B.length);

        // Solve the matrix A and B
        //let A_inv = math.inv(A);
        //console.log("A_inv");
        //console.table(A_inv);

        //let gamma = math.multiply(A_inv, B);

        let gamma = math.lusolve(A, B);
        console.log("gamma");
        console.table(gamma);

        // Compute the coefficient of pressure Cp and velocity
        let Vt = [];
        let Cp = [];
        for (let i = 0; i < num_panels; i++) {
            Vt[i] = 0;
            Cp[i] = 0;
        }

        for (let i = 0; i < num_panels; i++) {
            let addVal = 0;
            for (let j = 0; j < num_panels; j++) {
                addVal -= gamma[j]/(2*Math.PI) * L[i][j];
            }
            Vt[i] = this.u_inf * Math.sin(beta[i]) + addVal + gamma[i]/2;
            Cp[i] = 1 - (Vt[i]/this.u_inf)**2;
        }

        console.log("Vt");
        console.table(Vt);
        console.log("Cp");
        this.Cp = Cp;
        console.table(Cp);

        // Compute the coefficient of lift
        
        // Compute normal and axial coefficient of force
        let CN = [];
        let CA = [];
        for (let i = 0; i < num_panels; i++) {
            CN[i] = 0;
            CA[i] = 0;
        }

        for (let i = 0; i < num_panels; i++) {
            CN[i] = - Cp[i] * Math.sin(beta[i]) * S[i];
            CA[i] = - Cp[i] * Math.cos(beta[i]) * S[i];
        }

        // Compute the coefficient of lift
        let CL = 0;

        for (let i = 0; i < num_panels; i++) {
            CL += CN[i] * Math.cos(this.alpha) - CA[i] * Math.sin(this.alpha);
        }

        console.log("CL");
        console.table(CL);

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

    get_panels() {
        return this.panels;
    }

    get_A () {
        return this.A;
    }

    get_B () {
        return this.B;
    }

    get_Cp () {
        return this.Cp;
    }

    get_x_all() {
        return this.x_all;
    }

    get_y_all() {
        return this.y_all;
    }

}

export { NACA };