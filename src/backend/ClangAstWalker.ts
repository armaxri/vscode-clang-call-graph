import * as clang_ast from "./clang_ast_json";
import {
    IDatabase,
    FuncMentioning,
    FuncCall,
    Location,
    VirtualFuncMentioning,
    VirtualFuncCall,
} from "./IDatabase";
import { IAstWalker } from "./IAstWalker";

function hasCompoundStmtInInner(astElement: clang_ast.AstElement): boolean {
    if (astElement.inner) {
        const matches = astElement.inner.filter(
            (element) => element.kind === "CompoundStmt"
        );

        return matches.length > 0;
    }
    return false;
}

// Function calls refer to previous declarations by id.
// Therefore declarations need to be stored during the run
// and can be thrown away later.
type SimpleFuncDeclaration = {
    id: number;
    mentioningData: FuncMentioning;
};
type SimpleVirtualFuncDeclaration = {
    id: number;
    mentioningData: VirtualFuncMentioning;
    qualType: string;
};

class ClassDefinition {
    public className: string;
    public parentClasses: Array<ClassDefinition>;
    public virtualFuncs: Array<SimpleVirtualFuncDeclaration>;

    constructor(
        astElement: clang_ast.AstElement,
        knownClasses: Array<ClassDefinition>
    ) {
        this.className = astElement.name
            ? astElement.name
            : "Error! No name present.";
        this.parentClasses = new Array<ClassDefinition>();
        this.virtualFuncs = new Array<SimpleVirtualFuncDeclaration>();

        if (astElement.bases) {
            astElement.bases.forEach((base) => {
                const foundClass = knownClasses.find(
                    (knownClass) => knownClass.className === base.type.qualType
                );
                if (foundClass) {
                    this.parentClasses.push(foundClass);
                }
            });
        }
    }

    public findBaseFunction(
        funcName: string,
        qualType: string
    ): SimpleVirtualFuncDeclaration | undefined {
        for (const parentClass of this.parentClasses) {
            const foundFunc = parentClass.findBaseFunction(funcName, qualType);
            if (foundFunc) {
                return foundFunc;
            }
        }

        const foundFunc = this.virtualFuncs.find(
            (func) =>
                func.mentioningData.funcImpl.funcName === funcName &&
                func.qualType === qualType
        );
        return foundFunc;
    }
}

function isElementVirtualFuncDeclaration(
    element: clang_ast.AstElement
): boolean {
    const hasOtherAttribute: boolean = element.inner
        ? element.inner.some(
              (innerElement) =>
                  innerElement.kind === "CXXFinalAttr" ||
                  innerElement.kind === "OverrideAttr"
          )
        : false;
    return (
        element.kind === "CXXMethodDecl" &&
        (element.virtual === true || hasOtherAttribute)
    );
}

export class ClangAstWalker implements IAstWalker {
    private fileName: string = "";
    // Sadly we need to cache a few data, which are reported once
    // and no longer until a new value is seen.
    private lastSeenFileNameInFuncDecl: string = "";
    private lastSeenLocLineNumber: number = -1;
    private lastSeenRangeBeginLine: number = -1;
    private lastSeenRangeEndLine: number = -1;
    private lastCallExprBeginLocation: Location = { line: -1, column: -1 };
    private lastCallExprEndLocation: Location = { line: -1, column: -1 };

    private callingFuncName: string = "";
    private baseAstElement: clang_ast.AstElement;
    private database: IDatabase;
    private funcDeclarations: Array<SimpleFuncDeclaration> =
        new Array<SimpleFuncDeclaration>();
    private virtualFuncDeclarations: Array<SimpleVirtualFuncDeclaration> =
        new Array<SimpleVirtualFuncDeclaration>();
    private knownClasses: Array<ClassDefinition> = new Array<ClassDefinition>();
    private currentClassStack: Array<ClassDefinition> =
        new Array<ClassDefinition>();

    constructor(
        fileName: string,
        database: IDatabase,
        baseAstElement: clang_ast.AstElement
    ) {
        this.fileName = fileName;
        this.database = database;
        this.baseAstElement = baseAstElement;
    }

    public walkAst() {
        this.analyzeAstElement(this.baseAstElement);
    }

    public getFileName(): string {
        return this.fileName;
    }

    private analyzeAstElement(astElement: clang_ast.AstElement) {
        // The file name and the source line are only mentioned in the first
        // seen element of the file.
        // Therefore we need to cache the value.
        this.handleLocAndRange(astElement);

        if (
            astElement.kind === "FunctionDecl" ||
            astElement.kind === "CXXMethodDecl"
        ) {
            this.handleFunctionDecl(astElement);
        } else if (astElement.kind === "CXXRecordDecl") {
            this.handleClassDecl(astElement);
        } else {
            if (
                astElement.kind === "CallExpr" ||
                astElement.kind === "CXXMemberCallExpr"
            ) {
                this.updateLastCallExprLocation(astElement);
            } else if (
                astElement.kind === "DeclRefExpr" ||
                astElement.kind === "MemberExpr"
            ) {
                this.handleExprStmt(astElement);
            }

            if (astElement.inner) {
                astElement.inner.forEach((newAstElement) =>
                    this.analyzeAstElement(newAstElement)
                );
            }
        }
    }

    private handleLocAndRange(astElement: clang_ast.AstElement) {
        if (astElement.loc && astElement.loc.file) {
            this.lastSeenFileNameInFuncDecl = astElement.loc.file;
        }
        if (astElement.loc && astElement.loc.line) {
            this.lastSeenLocLineNumber = astElement.loc.line;
        }
        if (astElement.range && astElement.range.begin.line) {
            this.lastSeenRangeBeginLine = astElement.range.begin.line;
            // The end also may hit a new line. But in case it doesn't,
            // we record it here.
            this.lastSeenRangeEndLine = this.lastSeenRangeBeginLine;
        }
        if (astElement.range && astElement.range.end.line) {
            this.lastSeenRangeEndLine = astElement.range.end.line;
        }
    }

    private handleFunctionDecl(astElement: clang_ast.AstElement) {
        // Function declaration in function declaration is no C++ thing.
        // But still we do this since maybe we one day walk some nice
        // language like python or C++ gets extended.
        const currentCallingFuncName = this.callingFuncName;

        if (isElementVirtualFuncDeclaration(astElement)) {
            const currentClass =
                this.currentClassStack[this.currentClassStack.length - 1];
            const virtualFuncMentioning = this.createVirtualFuncMentioning(
                astElement,
                currentClass
            );
            this.recordVirtualFuncDecl(
                astElement,
                virtualFuncMentioning,
                currentClass
            );

            if (hasCompoundStmtInInner(astElement)) {
                this.database.registerVirtualFuncImplementation(
                    virtualFuncMentioning
                );
            } else {
                this.database.registerVirtualFuncDeclaration(
                    virtualFuncMentioning
                );
            }
        } else {
            const funcMentioning = this.createFuncMentioning(astElement);
            this.recordFuncDecl(astElement, funcMentioning);

            if (hasCompoundStmtInInner(astElement)) {
                this.database.registerFuncImplementation(funcMentioning);
            } else {
                this.database.registerFuncDeclaration(funcMentioning);
            }
        }

        this.callingFuncName =
            typeof astElement.mangledName === "string"
                ? astElement.mangledName
                : "";

        if (astElement.inner) {
            astElement.inner.forEach((newAstElement) =>
                this.analyzeAstElement(newAstElement)
            );
        }

        this.callingFuncName = currentCallingFuncName;
    }

    private handleClassDecl(astElement: clang_ast.AstElement) {
        const newClass = new ClassDefinition(astElement, this.knownClasses);
        this.knownClasses.push(newClass);
        this.currentClassStack.push(newClass);

        if (astElement.inner) {
            astElement.inner.forEach((newAstElement) =>
                this.analyzeAstElement(newAstElement)
            );
        }

        this.currentClassStack.pop();
    }

    private handleExprStmt(astElement: clang_ast.AstElement) {
        const calledFuncId: string | undefined = astElement.referencedDecl
            ? astElement.kind === "DeclRefExpr"
                ? astElement.referencedDecl.id
                : astElement.referencedMemberDecl
            : astElement.referencedMemberDecl
            ? astElement.referencedMemberDecl
            : undefined;
        if (calledFuncId) {
            const referencedDecl = this.funcDeclarations.find(
                (funcDec) => funcDec.id === Number(calledFuncId)
            );
            if (referencedDecl) {
                const funcCall = this.createFuncCall(
                    astElement,
                    referencedDecl
                );
                this.database.registerFuncCall(funcCall);
            }
            const referencedVirtualDecl = this.virtualFuncDeclarations.find(
                (funcDec) => funcDec.id === Number(calledFuncId)
            );
            if (referencedVirtualDecl) {
                const funcCall = this.createVirtualFuncCall(
                    astElement,
                    referencedVirtualDecl
                );
                this.database.registerVirtualFuncCall(funcCall);
            }
        }
    }

    private createFuncMentioning(
        astElement: clang_ast.AstElement
    ): FuncMentioning {
        const columnStart = astElement.loc
            ? astElement.loc.col
                ? astElement.loc.col
                : -1
            : -1;
        const columnEnd =
            columnStart +
            (astElement.loc
                ? astElement.loc.tokLen
                    ? astElement.loc.tokLen
                    : 0
                : 0);
        return {
            funcName: astElement.name
                ? astElement.name
                : "Error! No name present.",
            funcAstName: astElement.mangledName
                ? astElement.mangledName
                : "Error! No mangledName present.",
            file: this.lastSeenFileNameInFuncDecl,
            startLoc: {
                line: this.lastSeenLocLineNumber,
                column: columnStart,
            },
            endLoc: {
                line: this.lastSeenLocLineNumber,
                column: columnEnd,
            },
        };
    }

    private createVirtualFuncMentioning(
        astElement: clang_ast.AstElement,
        currentClass: ClassDefinition
    ): VirtualFuncMentioning {
        const funcMentioning = this.createFuncMentioning(astElement);
        const baseFunc = astElement.type
            ? currentClass.findBaseFunction(
                  funcMentioning.funcName,
                  astElement.type.qualType
              )
            : undefined;
        return {
            baseFuncAstName: baseFunc
                ? baseFunc.mentioningData.baseFuncAstName
                : funcMentioning.funcAstName,
            funcImpl: funcMentioning,
        };
    }

    private getRangeStartLocation(astElement: clang_ast.AstElement): Location {
        return {
            line:
                astElement.range &&
                astElement.range.begin &&
                astElement.range.begin.line
                    ? astElement.range.begin.line
                    : this.lastSeenRangeBeginLine,
            column:
                astElement.range &&
                astElement.range.begin &&
                astElement.range.begin.col
                    ? astElement.range.begin.col
                    : -1,
        };
    }

    private getRangeEndLocation(astElement: clang_ast.AstElement): Location {
        return {
            line:
                astElement.range &&
                astElement.range.end &&
                astElement.range.end.line
                    ? astElement.range.end.line
                    : astElement.range &&
                      astElement.range.begin &&
                      astElement.range.begin.line
                    ? astElement.range.begin.line
                    : this.lastSeenRangeBeginLine,
            column:
                astElement.range &&
                astElement.range.end &&
                astElement.range.end.col
                    ? astElement.range.end.col +
                      (astElement.range.end.tokLen
                          ? astElement.range.end.tokLen
                          : 0)
                    : -1,
        };
    }

    private recordFuncDecl(
        astElement: clang_ast.AstElement,
        funcMentioning: FuncMentioning
    ) {
        const newDecl: SimpleFuncDeclaration = {
            id: Number(astElement.id),
            mentioningData: funcMentioning,
        };

        this.funcDeclarations.push(newDecl);
    }

    private recordVirtualFuncDecl(
        astElement: clang_ast.AstElement,
        funcMentioning: VirtualFuncMentioning,
        currentClass: ClassDefinition
    ) {
        const newDecl: SimpleVirtualFuncDeclaration = {
            id: Number(astElement.id),
            mentioningData: funcMentioning,
            qualType: astElement.type ? astElement.type.qualType : "",
        };

        this.virtualFuncDeclarations.push(newDecl);
        currentClass.virtualFuncs.push(newDecl);
    }

    private updateLastCallExprLocation(astElement: clang_ast.AstElement) {
        this.lastCallExprBeginLocation = this.getRangeStartLocation(astElement);
        this.lastCallExprEndLocation = this.getRangeEndLocation(astElement);
    }

    private createFuncCall(
        astElement: clang_ast.AstElement,
        referencedDecl: SimpleFuncDeclaration
    ): FuncCall {
        return {
            callingFuncAstName: this.callingFuncName,
            callDetails: {
                funcName: referencedDecl.mentioningData.funcName,
                funcAstName: referencedDecl.mentioningData.funcAstName,
                file: this.lastSeenFileNameInFuncDecl,
                startLoc: this.lastCallExprBeginLocation,
                endLoc: this.lastCallExprEndLocation,
            },
        };
    }

    private createVirtualFuncCall(
        astElement: clang_ast.AstElement,
        referencedDecl: SimpleVirtualFuncDeclaration
    ): VirtualFuncCall {
        return {
            callingFuncAstName: this.callingFuncName,
            baseFuncAstName: referencedDecl.mentioningData.baseFuncAstName,
            callDetails: {
                funcName: referencedDecl.mentioningData.funcImpl.funcName,
                funcAstName: referencedDecl.mentioningData.funcImpl.funcAstName,
                file: this.lastSeenFileNameInFuncDecl,
                startLoc: this.lastCallExprBeginLocation,
                endLoc: this.lastCallExprEndLocation,
            },
        };
    }
}
