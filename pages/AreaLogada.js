export class AreaLogada {
    constructor(page) {
        this.page = page
    }

    async obterSaldo() {
        return this.page.locator('#account-balance')
    }
}