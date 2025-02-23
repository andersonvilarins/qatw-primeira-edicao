import { test, expect } from '@playwright/test'
import { obterCodigo2FA } from '../support/db'
import { LoginPage } from '../pages/loginPage';
import { AreaLogada } from '../pages/AreaLogada';
import { cleanJobs, getJob } from '../support/redis';
test('Acessar a conta do usuário com as credenciais válidas', async ({ page }) => {

    const loginPage = new LoginPage(page)
    const areaLogada = new AreaLogada(page)

    const usuario = {
        cpf: '00000014141',
        senha: '147258'
    }

    await cleanJobs()

    await loginPage.acessaPagina()
    await loginPage.informarCpf(usuario.cpf)
    await loginPage.informarSenha(usuario.senha)



    // estrutura de esperar a consulta do código da fila do redis -> fazendo a consulta no BD para obter o código
    await page.getByRole('heading', { name: 'Verificação em duas etapas' })
        .waitFor({ timeout: 3000 })

    const code = await getJob()
    // const codigo = await obterCodigo2FA(usuario.cpf)

    await loginPage.informarCod2FA(code)


    await expect(await areaLogada.obterSaldo()).toHaveText('R$ 5.000,00')
});

test('Erro ao logar com o código de autenticação for inválido', async ({ page }) => {
    const loginPage = new LoginPage(page)

    const usuario = {
        cpf: '00000014141',
        senha: '147258'
    }

    await loginPage.acessaPagina()
    await loginPage.informarCpf(usuario.cpf)
    await loginPage.informarSenha(usuario.senha)
    await loginPage.informarCod2FA('123456')

    await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.')
});