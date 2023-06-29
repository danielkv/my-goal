export function getErrorMessage(err: any): string {
    if (__DEV__) console.warn('MESSAGE CAUGHT', err)

    const code = err.details.code || err.code

    if (code) return getMessage(code, err.message)

    if (err instanceof Error || err.message) return err.message

    if (typeof err === 'string') return err

    return 'Erro desconhecido'
}

function getMessage(code: string, fallback: string): string {
    const message = errorMessages[code]
    if (message) return message

    return fallback
}

const errorMessages: Record<string, string> = {
    'auth/email-already-exists':
        'O e-mail fornecido já está em uso por outro usuário. Cada usuário precisa ter um e-mail exclusivo.',
    'auth/id-token-expired': 'O token de código do Firebase provisionado expirou.',
    'auth/id-token-revoked': 'O token de ID do Firebase foi revogado.',
    'auth/invalid-argument': 'Um argumento inválido foi fornecido a um método do Authentication.',
    'auth/invalid-display-name':
        'O valor fornecido para a propriedade do usuário displayName é inválido. Precisa ser uma string não vazia.',
    'auth/invalid-password-hash': 'O hash da senha precisa ser um buffer de byte válido.',
    'auth/invalid-phone-number': 'O número de telefone é inválido.',
    'auth/invalid-photo-url': 'A URL da imagem enviada é inválida',
    'auth/invalid-provider-data': 'O providerData precisa ser uma matriz válida de objetos UserInfo.',
    'auth/invalid-provider-id': 'O providerId precisa ser um string de identificador de provedor compatível válido.',
    'auth/invalid-oauth-responsetype': 'Apenas um responseType do OAuth deve ser definido como verdadeiro.',
    'auth/invalid-session-cookie-duration':
        'A duração do cookie da sessão precisa ser um número válido em milissegundos entre 5 minutos e 2 semanas.',
    'auth/invalid-uid': 'O uid fornecido precisa ser uma string não vazia com no máximo 128 caracteres.',
    'auth/invalid-user-import': 'O registro do usuário a ser importado é inválido.',
    'auth/maximum-user-count-exceeded': '	O número máximo permitido de usuários a serem importados foi excedido.',
    'auth/missing-android-pkg-name':
        'Um nome de pacote Android precisa ser fornecido para a instalação do app Android.',
    'auth/missing-continue-uri': 'Um URL de confirmação válido precisa ser fornecido na solicitação.',
    'auth/missing-hash-algorithm':
        'É necessário fornecer o algoritmo de geração de hash e seus parâmetros para importar usuários com hashes de senha.',
    'auth/missing-ios-bundle-id': '	A solicitação não tem um ID do pacote.',
    'auth/missing-uid': 'Um identificador uid é necessário para a operação atual.',
    'auth/missing-oauth-client-secret':
        'A chave secreta do cliente de configuração do OAuth é necessária para ativar o fluxo de código do OIDC.',
    'auth/operation-not-allowed':
        'O provedor de login fornecido está desativado para o projeto do Firebase. Ative-o na seção Método de login do Console do Firebase.',
    'auth/phone-number-already-exists': 'Este número telefone já está sendo usado por outro usuário',
    'auth/reserved-claims':
        'Uma ou mais declarações de usuário personalizadas fornecidas para setCustomUserClaims() são reservadas. Por exemplo, não use as declarações específicas do OIDC, como sub, iat, iss, exp, aud, auth_time etc., como chaves para declarações personalizadas.',
    'auth/session-cookie-expired': 'A sessão expirou, faça o login novamente',
    'auth/session-cookie-revoked': 'A sessão expirou, faça o login novamente',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Usuário ou senha incorreto',
    'auth/too-many-requests':
        'Seu acesso foi temporariamente desabilitado devido ao número de tentativas. Você pode liberar o acesso imediatamente resetando sua senha, ou tentar novamente mais tarde.',
    'auth/user-disabled': 'Seu usuário ainda não foi habilitado',
}
