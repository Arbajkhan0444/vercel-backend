import camelCase from "./case"

const modelSyntax = (feature: string)=>{
    const name = camelCase(feature)

    return [
        `import { model, Schema } from 'mongoose'\n`,
        `const schema = new Schema({`,
        `\t`,
        `},{timestamps: true})\n`,
        `const ${name}Model = model('${name}', schema)`,
        `export default ${name}Model`
    ]
}

export default modelSyntax