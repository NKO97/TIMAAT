package de.bitgilde.TIMAAT.processing.audio.api;

/**
 * Representation of a complex number
 *
 * @author Nico Kotlenga
 * @since 08.08.25
 */
public class Complex {
    private final double real;
    private final double imag;

    public Complex(double real, double imag) {
        this.real = real;
        this.imag = imag;
    }

    public Complex add(Complex other) {
        return new Complex(this.real + other.real, this.imag + other.imag);
    }

    public Complex subtract(Complex other) {
        return new Complex(this.real - other.real, this.imag - other.imag);
    }

    public Complex multiply(Complex other) {
        double newReal = this.real * other.real - this.imag * other.imag;
        double newImag = this.real * other.imag + this.imag * other.real;
        return new Complex(newReal, newImag);
    }

    public double magnitude() {
        return Math.sqrt(real * real + imag * imag);
    }
}
