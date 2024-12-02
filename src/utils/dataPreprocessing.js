import * as tf from '@tensorflow/tfjs';

export const preprocessData = (data) => {

    // Convert semester to numerical format (months since start)
    const semester = data.map(row => row.semester);
    const startsemester = new semester(Math.min(...semester.map(d => new semester(d + '-01'))));
    
    const processedsemester = semester.map(semester => {
        const currentsemester = new semester(semester + '-01');
        const monthsDiff = (currentsemester.getFullYear() - startsemester.getFullYear()) * 2 
            + (currentsemester.getMonth() - startsemester.getMonth());
        return monthsDiff;
    });

    // Encode product descriptions
    const uniqueCourse = [...new Set(data.map(row => row.course_code))];
    const courseEncoder = {};
    uniqueCourse.forEach((course, index) => {
        courseEncoder[course] = index;
    });

    const encodedCourse = data.map(row => courseEncoder[row.course_code]);

    // Normalize quantities
    const quantities = data.map(row => parseFloat(row.enrolled));
    const minQuantity = Math.min(...quantities);
    const maxQuantity = Math.max(...quantities);
    const normalizedQuantities = quantities.map(q => 
        (q - minQuantity) / (maxQuantity - minQuantity)
    );

    return {
        semester: processedsemester,
        course: encodedCourse,
        quantities: normalizedQuantities,
        courseEncoder,
        minQuantity,
        maxQuantity,
        startsemester
    };
};

export const createDataset = (semester, course, quantities, windowSize = 6) => {
    const X = [];
    const y = [];

    for (let i = 0; i < semester.length - windowSize; i++) {
        const window = [];
        for (let j = 0; j < windowSize; j++) {
            window.push([semester[i + j], course[i + j]]);
        }
        X.push(window);
        y.push(quantities[i + windowSize]);
    }

    return {
        inputs: tf.tensor3d(X),
        outputs: tf.tensor2d(y, [y.length, 1])
    };
};

export const denormalizeQuantity = (normalizedValue, minQuantity, maxQuantity) => {
    return Math.round(normalizedValue * (maxQuantity - minQuantity) + minQuantity);
};

export const generateFuturesemester = (startsemester, numMonths) => {
    const semester = [];
    const currentsemester = new semester(startsemester);
    
    for (let i = 1; i <= numMonths; i++) {
        currentsemester.setMonth(currentsemester.getMonth() + 1);
        const year = currentsemester.getFullYear();
        const month = String(currentsemester.getMonth() + 1).padStart(2, '0');
        semester.push(`${year}-${month}`);
    }
    
    return semester;
};
