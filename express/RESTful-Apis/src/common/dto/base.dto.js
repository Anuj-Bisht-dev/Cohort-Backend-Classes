import Joi from "joi";

class BaseDto {
    static schema = Joi.object({}); // this is created as empty obj we expect when user will use schema then it will overwrite this

    static validate(data) {
        const { error, value } = this.schema.validate(data, {
            abortEarly: false, // it stop the req when the first err hits. by default its value is true 
            // but we want it false to show all err. in end that is why false
            stripUnknown: true // this used when we donot want extra fields except what we mentioned (DDOS can prevents using this)
        })

        if (error) {
            const errors = error.details.map((d) => d.message);
            return { errors, value: null }
        }
        return { error: null, value }
    }
}

export { BaseDto }
