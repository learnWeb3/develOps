import mongoose from "mongoose";
const { Schema, model } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const answerSchema = new Schema({
    content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100,
    },
    question: {
        type: ObjectId,
        required: true,
        ref: 'Question'
    },
    isValid: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true,
    toJSON:  { virtuals: true },
    toObject:  { getters: true },
});

answerSchema.statics.register = async function(params={
    content: null,
    questionId: null,
    isValid: false
}){
    if(params.questionId && content && typeof isValid === 'boolean' )
    {
        const newAnswer = new this({
            ...params
        })
    }else{
        throw
    }
}




export default model('Answer', answerSchema)

