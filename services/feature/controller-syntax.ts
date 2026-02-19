import camelCase from "./case"

const controllerSyntax = (feature: string)=>{
    const name = camelCase(feature)
    const ui = [
         `import ${name}Model from './${feature}.model'`,
         `import { Request, Response } from 'express'\n`,
         `export const fetch${name} = (req: Request, res: Response)=>{`,
         `\tres.send("Hello")`,
         `}`

    ]
    return ui
}

export default controllerSyntax