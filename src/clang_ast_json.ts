export interface IncludedFromElement {
    file: string;
}

export interface LocElement {
    offset?: number;
    file?: string;
    line?: number;
    col?: number;
    tokLen?: number;
    includedFrom?: IncludedFromElement;
}

export interface RangeElement {
    begin: LocElement;
    end: LocElement;
}

export interface TypeElement {
    desugaredQualType?: string;
    qualType: string;
}

export interface BasesElement {
    accessSpec?: string;
    type: TypeElement;
    writtenAccess?: string;
}

export interface AstElement {
    id: string;
    kind: string;
    loc?: LocElement;
    range?: RangeElement;
    isImplicit?: boolean;
    isUsed?: boolean;
    previousDecl?: string;
    name?: string;
    mangledName?: string;
    type?: TypeElement;
    valueCategory?: string;
    value?: string;
    castKind?: string;
    referencedDecl?: AstElement;
    opcode?: string;
    decl?: AstElement;
    virtual?: boolean;
    storageClass?: string;
    referencedMemberDecl?: string;
    inner?: Array<AstElement>;
    bases?: Array<BasesElement>;
}

/*
Taken from https://github.com/dtolnay/clang-ast/blob/master/src/kind.rs
Since only a few elements are needed and maybe something was forgotten.
export enum ClangAstKindEnum {
    AbiTagAttr = "AbiTagAttr",
    AccessSpecDecl = "AccessSpecDecl",
    AliasAttr = "AliasAttr",
    AlignedAttr = "AlignedAttr",
    AllocAlignAttr = "AllocAlignAttr",
    AllocSizeAttr = "AllocSizeAttr",
    AlwaysInlineAttr = "AlwaysInlineAttr",
    ArrayInitIndexExpr = "ArrayInitIndexExpr",
    ArrayInitLoopExpr = "ArrayInitLoopExpr",
    ArraySubscriptExpr = "ArraySubscriptExpr",
    ArrayTypeTraitExpr = "ArrayTypeTraitExpr",
    AsmLabelAttr = "AsmLabelAttr",
    AtomicExpr = "AtomicExpr",
    AtomicType = "AtomicType",
    AttributedStmt = "AttributedStmt",
    AttributedType = "AttributedType",
    AutoType = "AutoType",
    AvailabilityAttr = "AvailabilityAttr",
    BinaryOperator = "BinaryOperator",
    BindingDecl = "BindingDecl",
    BlockPointerType = "BlockPointerType",
    BreakStmt = "BreakStmt",
    BuiltinAttr = "BuiltinAttr",
    BuiltinBitCastExpr = "BuiltinBitCastExpr",
    BuiltinTemplateDecl = "BuiltinTemplateDecl",
    BuiltinType = "BuiltinType",
    CStyleCastExpr = "CStyleCastExpr",
    CXX11NoReturnAttr = "CXX11NoReturnAttr",
    CXXBindTemporaryExpr = "CXXBindTemporaryExpr",
    CXXBoolLiteralExpr = "CXXBoolLiteralExpr",
    CXXCatchStmt = "CXXCatchStmt",
    CXXConstCastExpr = "CXXConstCastExpr",
    CXXConstructExpr = "CXXConstructExpr",
    CXXConstructorDecl = "CXXConstructorDecl",
    CXXConversionDecl = "CXXConversionDecl",
    CXXCtorInitializer = "CXXCtorInitializer",
    CXXDeductionGuideDecl = "CXXDeductionGuideDecl",
    CXXDefaultArgExpr = "CXXDefaultArgExpr",
    CXXDefaultInitExpr = "CXXDefaultInitExpr",
    CXXDeleteExpr = "CXXDeleteExpr",
    CXXDependentScopeMemberExpr = "CXXDependentScopeMemberExpr",
    CXXDestructorDecl = "CXXDestructorDecl",
    CXXDynamicCastExpr = "CXXDynamicCastExpr",
    CXXFoldExpr = "CXXFoldExpr",
    CXXForRangeStmt = "CXXForRangeStmt",
    CXXFunctionalCastExpr = "CXXFunctionalCastExpr",
    CXXInheritedCtorInitExpr = "CXXInheritedCtorInitExpr",
    CXXMemberCallExpr = "CXXMemberCallExpr",
    CXXMethodDecl = "CXXMethodDecl",
    CXXNewExpr = "CXXNewExpr",
    CXXNoexceptExpr = "CXXNoexceptExpr",
    CXXNullPtrLiteralExpr = "CXXNullPtrLiteralExpr",
    CXXOperatorCallExpr = "CXXOperatorCallExpr",
    CXXPseudoDestructorExpr = "CXXPseudoDestructorExpr",
    CXXRecordDecl = "CXXRecordDecl",
    CXXReinterpretCastExpr = "CXXReinterpretCastExpr",
    CXXRewrittenBinaryOperator = "CXXRewrittenBinaryOperator",
    CXXScalarValueInitExpr = "CXXScalarValueInitExpr",
    CXXStaticCastExpr = "CXXStaticCastExpr",
    CXXTemporaryObjectExpr = "CXXTemporaryObjectExpr",
    CXXThisExpr = "CXXThisExpr",
    CXXThrowExpr = "CXXThrowExpr",
    CXXTryStmt = "CXXTryStmt",
    CXXTypeidExpr = "CXXTypeidExpr",
    CXXUnresolvedConstructExpr = "CXXUnresolvedConstructExpr",
    CallExpr = "CallExpr",
    CallbackAttr = "CallbackAttr",
    CaseStmt = "CaseStmt",
    CharacterLiteral = "CharacterLiteral",
    ClassTemplateDecl = "ClassTemplateDecl",
    ClassTemplatePartialSpecializationDecl = "ClassTemplatePartialSpecializationDecl",
    ClassTemplateSpecializationDecl = "ClassTemplateSpecializationDecl",
    ColdAttr = "ColdAttr",
    ComplexType = "ComplexType",
    CompoundAssignOperator = "CompoundAssignOperator",
    CompoundRequirement = "CompoundRequirement",
    CompoundStmt = "CompoundStmt",
    ConceptDecl = "ConceptDecl",
    ConceptSpecializationExpr = "ConceptSpecializationExpr",
    ConditionalOperator = "ConditionalOperator",
    ConstAttr = "ConstAttr",
    ConstantArrayType = "ConstantArrayType",
    ConstantExpr = "ConstantExpr",
    ConstructorUsingShadowDecl = "ConstructorUsingShadowDecl",
    ContinueStmt = "ContinueStmt",
    DLLImportAttr = "DLLImportAttr",
    DecayedType = "DecayedType",
    DeclRefExpr = "DeclRefExpr",
    DeclStmt = "DeclStmt",
    DecltypeType = "DecltypeType",
    DecompositionDecl = "DecompositionDecl",
    DefaultStmt = "DefaultStmt",
    DependentNameType = "DependentNameType",
    DependentScopeDeclRefExpr = "DependentScopeDeclRefExpr",
    DependentSizedArrayType = "DependentSizedArrayType",
    DependentTemplateSpecializationType = "DependentTemplateSpecializationType",
    DeprecatedAttr = "DeprecatedAttr",
    DiagnoseIfAttr = "DiagnoseIfAttr",
    DisableTailCallsAttr = "DisableTailCallsAttr",
    DoStmt = "DoStmt",
    ElaboratedType = "ElaboratedType",
    EmptyDecl = "EmptyDecl",
    EnableIfAttr = "EnableIfAttr",
    EnumConstantDecl = "EnumConstantDecl",
    EnumDecl = "EnumDecl",
    EnumType = "EnumType",
    ExprWithCleanups = "ExprWithCleanups",
    FallThroughAttr = "FallThroughAttr",
    FieldDecl = "FieldDecl",
    FinalAttr = "FinalAttr",
    FloatingLiteral = "FloatingLiteral",
    ForStmt = "ForStmt",
    FormatArgAttr = "FormatArgAttr",
    FormatAttr = "FormatAttr",
    FriendDecl = "FriendDecl",
    FullComment = "FullComment",
    FunctionDecl = "FunctionDecl",
    FunctionProtoType = "FunctionProtoType",
    FunctionTemplateDecl = "FunctionTemplateDecl",
    GCCAsmStmt = "GCCAsmStmt",
    GNUInlineAttr = "GNUInlineAttr",
    GNUNullExpr = "GNUNullExpr",
    GotoStmt = "GotoStmt",
    IfStmt = "IfStmt",
    ImplicitCastExpr = "ImplicitCastExpr",
    ImplicitValueInitExpr = "ImplicitValueInitExpr",
    IncompleteArrayType = "IncompleteArrayType",
    IndirectFieldDecl = "IndirectFieldDecl",
    InitListExpr = "InitListExpr",
    InjectedClassNameType = "InjectedClassNameType",
    IntegerLiteral = "IntegerLiteral",
    InternalLinkageAttr = "InternalLinkageAttr",
    LValueReferenceType = "LValueReferenceType",
    LabelStmt = "LabelStmt",
    LambdaExpr = "LambdaExpr",
    LikelyAttr = "LikelyAttr",
    LinkageSpecDecl = "LinkageSpecDecl",
    MaterializeTemporaryExpr = "MaterializeTemporaryExpr",
    MaxFieldAlignmentAttr = "MaxFieldAlignmentAttr",
    MayAliasAttr = "MayAliasAttr",
    MemberExpr = "MemberExpr",
    MemberPointerType = "MemberPointerType",
    ModeAttr = "ModeAttr",
    NamespaceAliasDecl = "NamespaceAliasDecl",
    NamespaceDecl = "NamespaceDecl",
    NestedRequirement = "NestedRequirement",
    NoAliasAttr = "NoAliasAttr",
    NoDebugAttr = "NoDebugAttr",
    NoEscapeAttr = "NoEscapeAttr",
    NoInlineAttr = "NoInlineAttr",
    NoSanitizeAttr = "NoSanitizeAttr",
    NoThrowAttr = "NoThrowAttr",
    NoUniqueAddressAttr = "NoUniqueAddressAttr",
    NonNullAttr = "NonNullAttr",
    NonTypeTemplateParmDecl = "NonTypeTemplateParmDecl",
    NullStmt = "NullStmt",
    OffsetOfExpr = "OffsetOfExpr",
    OpaqueValueExpr = "OpaqueValueExpr",
    OverrideAttr = "OverrideAttr",
    OwnerAttr = "OwnerAttr",
    PackExpansionExpr = "PackExpansionExpr",
    PackExpansionType = "PackExpansionType",
    PackedAttr = "PackedAttr",
    ParagraphComment = "ParagraphComment",
    ParenExpr = "ParenExpr",
    ParenListExpr = "ParenListExpr",
    ParenType = "ParenType",
    ParmVarDecl = "ParmVarDecl",
    PointerAttr = "PointerAttr",
    PointerType = "PointerType",
    PredefinedExpr = "PredefinedExpr",
    PreferredNameAttr = "PreferredNameAttr",
    PureAttr = "PureAttr",
    QualType = "QualType",
    RValueReferenceType = "RValueReferenceType",
    RecordDecl = "RecordDecl",
    RecordType = "RecordType",
    RecoveryExpr = "RecoveryExpr",
    RequiresExpr = "RequiresExpr",
    RestrictAttr = "RestrictAttr",
    ReturnStmt = "ReturnStmt",
    ReturnsNonNullAttr = "ReturnsNonNullAttr",
    ReturnsTwiceAttr = "ReturnsTwiceAttr",
    SimpleRequirement = "SimpleRequirement",
    SizeOfPackExpr = "SizeOfPackExpr",
    StaticAssertDecl = "StaticAssertDecl",
    StringLiteral = "StringLiteral",
    SubstNonTypeTemplateParmExpr = "SubstNonTypeTemplateParmExpr",
    SubstTemplateTypeParmType = "SubstTemplateTypeParmType",
    SwiftAttrAttr = "SwiftAttrAttr",
    SwitchStmt = "SwitchStmt",
    TemplateArgument = "TemplateArgument",
    TemplateSpecializationType = "TemplateSpecializationType",
    TemplateTemplateParmDecl = "TemplateTemplateParmDecl",
    TemplateTypeParmDecl = "TemplateTypeParmDecl",
    TemplateTypeParmType = "TemplateTypeParmType",
    TextComment = "TextComment",
    TranslationUnitDecl = "TranslationUnitDecl",
    TypeAliasDecl = "TypeAliasDecl",
    TypeAliasTemplateDecl = "TypeAliasTemplateDecl",
    TypeOfExprType = "TypeOfExprType",
    TypeRequirement = "TypeRequirement",
    TypeTraitExpr = "TypeTraitExpr",
    TypeVisibilityAttr = "TypeVisibilityAttr",
    TypedefDecl = "TypedefDecl",
    TypedefType = "TypedefType",
    UnaryExprOrTypeTraitExpr = "UnaryExprOrTypeTraitExpr",
    UnaryOperator = "UnaryOperator",
    UnaryTransformType = "UnaryTransformType",
    UnavailableAttr = "UnavailableAttr",
    UnlikelyAttr = "UnlikelyAttr",
    UnresolvedLookupExpr = "UnresolvedLookupExpr",
    UnresolvedMemberExpr = "UnresolvedMemberExpr",
    UnresolvedUsingIfExistsDecl = "UnresolvedUsingIfExistsDecl",
    UnresolvedUsingTypenameDecl = "UnresolvedUsingTypenameDecl",
    UnresolvedUsingValueDecl = "UnresolvedUsingValueDecl",
    UnusedAttr = "UnusedAttr",
    UserDefinedLiteral = "UserDefinedLiteral",
    UsingDecl = "UsingDecl",
    UsingDirectiveDecl = "UsingDirectiveDecl",
    UsingEnumDecl = "UsingEnumDecl",
    UsingIfExistsAttr = "UsingIfExistsAttr",
    UsingShadowDecl = "UsingShadowDecl",
    UsingType = "UsingType",
    VTablePointerAuthenticationAttr = "VTablePointerAuthenticationAttr",
    VarDecl = "VarDecl",
    VarTemplateDecl = "VarTemplateDecl",
    VarTemplatePartialSpecializationDecl = "VarTemplatePartialSpecializationDecl",
    VarTemplateSpecializationDecl = "VarTemplateSpecializationDecl",
    VisibilityAttr = "VisibilityAttr",
    WarnUnusedResultAttr = "WarnUnusedResultAttr",
    WeakImportAttr = "WeakImportAttr",
    WeakRefAttr = "WeakRefAttr",
    WhileStmt = "WhileStmt",
}
*/
