import auth from "./auth.action"
import account from "./tenants/account.action";
import accountSubtype from "./tenants/account_subtype.action";
import item from './tenants/item.action'
import journalEntry from "./tenants/journal_entry.action";

export const server = {
    auth,
    item,
    account,
    accountSubtype,
    journalEntry,
};
