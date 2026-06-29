/**
 * Utility for time-seeded shuffling to ensure a fresh experience every 10 minutes.
 */

/**
 * Returns a stable seed that changes every 10 minutes.
 */
export const getTimeSeed = () => {
    return Math.floor(Date.now() / (10 * 60 * 1000));
};

/**
 * A predictable PRNG based on a seed.
 */
const sfc32 = (a: number, b: number, c: number, d: number) => {
    return () => {
        a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
        let t = (a + b | 0) + d | 0;
        d = d + 1 | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    };
};

/**
 * Shuffles an array based on a numeric seed.
 */
export const shuffleWithSeed = <T>(array: T[], seed: number): T[] => {
    const shuffled = [...array];
    // Create a simple seeded random generator
    const rng = sfc32(0x9E3779B9, seed, 0x517CC1B7, 0x1F23B89A);

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

/**
 * Returns a shuffled version of an array that changes every 10 minutes.
 */
export const getTimeSeededShuffle = <T>(array: T[]): T[] => {
    return shuffleWithSeed(array, getTimeSeed());
};

/**
 * Returns a subset of items that rotates every 10 minutes.
 */
export const getTimeSeededSubset = <T>(array: T[], count: number): T[] => {
    const shuffled = getTimeSeededShuffle(array);
    return shuffled.slice(0, count);
};
