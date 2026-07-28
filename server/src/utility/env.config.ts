import dotenv from "dotenv"

function configureEnv(conf: string): void {
    const envSrcPath: string = "../env/";
    let file: string = ".env.development";
    switch (conf) {
        case "dev": {
            file = ".env.development";
            break;
        }
        case "prod": {
            file = ".env.production";
            break;
        }
        case "test": {
            file = ".env.testing";
            break;
        }
    }
    dotenv.config({
        path: `${envSrcPath}${file}`,
        quiet: true
    })
}

export default configureEnv;