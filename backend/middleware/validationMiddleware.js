import {body,validationResult} from 'express-validator';

export const loginValidation = [
    body("email").isEmail().withMessage("Invalid email address!"),
    body("password").isLength({min:6}).withMessage("Password must be 6 characters long")
]

export const registerValidation = [
    body("position")
    .notEmpty()
    .withMessage("Position is required"),
    body("lastName")
        .notEmpty()
        .withMessage("Lastname is required!"),
    body("firstName")
        .notEmpty()
        .withMessage("Firstname is required!"),
    body("middleName")
        .notEmpty()
        .withMessage("Middle name is required!"),
        body("email")
            .isEmail()
            .withMessage("Invalid email address!")
            .isLength({ max: 40 })
            .withMessage(`Email address must not exceed 40 characters!`),
    body("phoneNumber")
        .matches(/^(09|\+639)\d{9}$/)
        .withMessage("Invalid phone format!"),
    body("address.street")
        .notEmpty()
        .withMessage("Street is required!"),
    body("address.municipality")
        .notEmpty()
        .withMessage("Municipality is required!"),
    body("address.province")
        .notEmpty()
        .withMessage("Province is required!"),
    body("address.postalCode")
        .notEmpty()
        .withMessage("Postal code is required!"),
    body("address.country")
        .notEmpty()
        .withMessage("Country is required!"),
    body("gender")
        .isIn(['Male', 'Female'])
        .withMessage("Invalid gender value!"),
    body("bDate")
        .isISO8601()
        .toDate()
        .withMessage("Invalid birthdate format!")
        .custom(value => {
            let birthDate = new Date(value);
            let today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            let monthDiff = today.getMonth() - birthDate.getMonth();

            if(monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())){
                age--;
            }
            if(birthDate > today){
                throw new Error("Birthdate cannot be a future date!");
            }
            if(age < 18 || age > 60){
                throw new Error("Age must be between 18 and 60 years!");
            }
            return true;
        }),
];

export const changePasswordValidation = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required."),
    body("newPassword")
        .notEmpty()
        .withMessage("New password is required.")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters long.")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/)
        .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."),
    body("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password is required.")
        .custom((value, { req }) => {
            if(value !== req.body.newPassword){
                throw new Error("Passwords do not match.");
            }
            return true;
        }),
];

export const resendVerificationValidation = [
    body("email")
        .isEmail()
        .withMessage("Invalid email address!"),
];

export const forgotPasswordValidation = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email address.")
        .notEmpty()
        .withMessage("Email is required."),
];

export const resetPasswordOtpValidation = [
    body("otp")
        .notEmpty()
        .withMessage("OTP is required."),
    body("newPassword")
    .notEmpty()
    .withMessage("New password is required.")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."),
];

export const compensationPlanningValidation = [
    body('position').notEmpty().withMessage('Position is required.'),
    body('hourlyRate').isFloat({ gt: 0 }).withMessage('Hourly rate must be a positive number.'),
    body('overTimeRate').isFloat({ gt: 0 }).withMessage('Overtime rate must be a positive number.'),
    body('holidayRate').isFloat({ gt: 0 }).withMessage('Holiday rate must be a positive number.'),
    body('incentives').notEmpty().withMessage('Incentives are required.'),
    body('benefits').isString().notEmpty().withMessage('Benefits must be a non-empty string.'),
    body('performanceMetrics').isArray().withMessage('Performance metrics must be an array.')
        .custom(value => value.every(metric => typeof metric === 'number')).withMessage('Performance metrics must be an array of numbers.'),
    body('salaryAdjustmentGuidelines').notEmpty().withMessage('Salary adjustment guidelines are required.'),
    body('effectiveDate').isISO8601().withMessage('Effective date must be a valid date.')
        .custom(value => {
            const inputDate = new Date(value);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            if (inputDate < currentDate) throw new Error('Effective date cannot be in the past.');
            return true;
        }),
    body('comments').optional().isString().withMessage('Comments must be a string.'),
];

export const reviewRequestValidation = [
    body('action')
        .isIn(['approve', 'deny'])
        .withMessage('Action must be either "approve" or "deny".')
];

export const validate = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({success:false, errors:errors.array() });
    }
    next();
}