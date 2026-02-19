import { existsSync, mkdirSync, writeFileSync } from "fs"
import modelSyntax from "./model-syntax"
import logger from "node-color-log"
import path from "path"
import camelCase from "./case"
import controllerSyntax from "./controller-syntax"
import routerSyntax from "./router-syntax"
import endpointSetup from "./endpoint"
const argArray = process.argv.slice(2)
const args = argArray.map((item)=>item.toLowerCase())
const feature = args.join("-")
const root = process.cwd()
const folder = path.join(root, "src", feature)

const featureService = ()=>{
    try {
        if(existsSync(folder))
            return logger.error("Service already exist !")
    
        mkdirSync(folder)

        // Model
        writeFileSync(path.join(folder, `${feature}.model.ts`), modelSyntax(feature).join("\n").toString())

        // Controller
        writeFileSync(path.join(folder, `${feature}.controller.ts`), controllerSyntax(feature).join("\n").toString())

        // Routes
        writeFileSync(path.join(folder, `${feature}.routes.ts`), routerSyntax(feature).join("\n").toString())
        
        // Interface
        writeFileSync(path.join(folder, `${feature}.interface.ts`), '// Interface')

        endpointSetup(feature)
    
        logger.success(`${feature} Service Created !`)
    }
    catch(err: any)
    {
        logger.error(err.message)
    }
}

featureService()