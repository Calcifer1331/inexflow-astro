<script lang="ts">
    import Alert from "@/components/Alert.svelte";
    import FieldText from "@/components/FieldText.svelte";
    import LinkButton from "@/components/atoms/ActionLink.svelte";
    import SelectField from "@/components/SelectField.svelte";
    import {
        createLedgerRecordSchema,
        createLedgerRecordSchemaV2,
        type CreateLedgerRecordSchema,
    } from "@schema/journal_entry.schema";
    import { actions } from "astro:actions";
    import { onDestroy, onMount } from "svelte";
    import { SvelteMap } from "svelte/reactivity";
    import ActionButton from "@/components/atoms/ActionButton.svelte";
    import { currencyFormatter } from "@/lib/helpers/format";
    import { Tween } from "svelte/motion";
    import { formValidator } from "@/lib/helpers/formValidator.svelte";

    let {
        records = $bindable([]),
        validateRecordField,
        setRecordError,
    }: {
        records?: CreateLedgerRecordSchema[];
        validateRecordField: () => void;
        setRecordError: (error: string) => void;
    } = $props();

    type Account = NonNullable<
        Awaited<ReturnType<typeof actions.account.findAll>>["data"]
    >[number];
    let accounts: SvelteMap<
        Account["id"],
        Omit<Account, "id">
    > = new SvelteMap();

    const { form, inputErrors, value, validateAll, validateField } =
        formValidator(createLedgerRecordSchema, {
            debit: 1,
            credit: 0,
        });

    let errors = $state<string | null>(null);

    // let formRecord = $state<Partial<CreateLedgerRecordSchema>>({
    //     debit: 1,
    //     credit: 0,
    // });

    let indexToEdit = $state<number | null>(null);

    let debitTween = Tween.of(() =>
        records.reduce((pre, { debit }) => pre + debit, 0),
    );
    let creditTween = Tween.of(() =>
        records.reduce((pre, { credit }) => pre + credit, 0),
    );

    let valanced = $derived(debitTween.target === creditTween.target);
    $inspect(valanced);

    let modalEl = $state<HTMLDivElement | null>(null); // referencia al elemento del modal
    let bsModalInstance: any;

    async function findAccounts() {
        const { data, error } = await actions.account.findAll();
        if (error) {
            errors = `Codigo: ${error.code}, Mensaje: ${error.message}`;
            return;
        }
        data.forEach(({ id, ...others }) => accounts.set(id, others));
    }

    function removeRecord(index: number) {
        records = records.filter((_, i) => i !== index);
    }

    function editRecord(index: number) {
        indexToEdit = index;
        const toEdit = records.at(index);
        if (!toEdit) return;
        value.accountId = toEdit.accountId;
        value.credit = toEdit.credit;
        value.debit = toEdit.debit;
        value.reference = toEdit.reference;
        value.voucher = toEdit.voucher;
        showModal();
    }

    function addRecord(
        e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
    ) {
        e.preventDefault();

        const parseData = validateAll();

        //todo bien
        if (!parseData || form.hasErrors) return;

        if (indexToEdit !== null) {
            records[indexToEdit] = parseData;
        } else records.push({ ...parseData });

        hideModal();
    }

    function showModal() {
        bsModalInstance?.show();
        validateRecordField();
        // if (!valanced) setRecordError("La entrada no esta valanceado");
    }
    function hideModal() {
        bsModalInstance?.hide();
        indexToEdit = null;
        validateRecordField();
        // if (!valanced) setRecordError("La entrada no esta valanceado");
    }

    onMount(async () => {
        await findAccounts();
        bsModalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    });

    // cuando el componente sea destruido, limpiamos
    onDestroy(() => {
        bsModalInstance?.dispose();
    });
</script>

<div class="row">
    <div class="row">
        <div class="col">
            <label for="records" class="form-label h5">Registros</label>
        </div>
        <div class="col-auto">
            <button
                type="button"
                class="btn btn-primary"
                onclick={showModal}
                id="btn-add"
            >
                Añadir Registro
            </button>
        </div>
    </div>
    <div class="table-responsive">
        <table class="table text-center">
            <thead>
                <tr>
                    <th scope="col">Referencia</th>
                    <th scope="col">Cuenta</th>
                    <th scope="col">Debito</th>
                    <th scope="col">Credito</th>
                    <th scope="col">Acción</th>
                </tr>
            </thead>
            <tbody>
                {#if records && records.length}
                    {#each records as { accountId, credit, debit, reference, voucher }, i}
                        <tr>
                            <td>
                                {reference}
                            </td>
                            <td>
                                {accounts.get(accountId)?.name}
                            </td>
                            <td>
                                {debit ? currencyFormatter.format(debit) : "--"}
                            </td>
                            <td>
                                {credit
                                    ? currencyFormatter.format(credit)
                                    : "--"}
                            </td>
                            <td>
                                <div class="btn-group">
                                    <ActionButton
                                        type="button"
                                        action="edit"
                                        onclick={() => editRecord(i)}
                                    />
                                    <ActionButton
                                        type="button"
                                        action="delete"
                                        onclick={() => removeRecord(i)}
                                    />
                                </div>
                            </td>
                        </tr>
                    {/each}
                {/if}
            </tbody>
            <tfoot>
                <tr>
                    <td>Total</td>
                    <td></td>
                    <td>{currencyFormatter.format(debitTween.current)}</td>
                    <td>{currencyFormatter.format(creditTween.current)}</td>
                    <td></td>
                </tr>
            </tfoot>
        </table>
        {#if errors}
            <div
                class="alert alert-dismissible fade show alert-danger"
                role="alert"
            >
                Ha ocurrido un error: {errors}
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Cerrar"
                ></button>
            </div>
        {/if}
    </div>
    {#if records.length}
        <Alert type={valanced ? "success" : "warning"}>
            {#if valanced}
                Las entradas estan Valanceadas!!
            {:else}
                Las entradas no estan Valanceadas!!
            {/if}
        </Alert>
    {/if}
    <div
        class="modal fade"
        bind:this={modalEl}
        tabindex="-1"
        aria-labelledby="itemModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="itemModalLabel">
                        {indexToEdit !== null ? "Editar" : "Agregar"} Registro
                    </h1>
                    <button
                        type="button"
                        class="btn-close"
                        aria-label="Close"
                        onclick={hideModal}
                    ></button>
                </div>
                <div class="modal-body">
                    <form onsubmit={addRecord}>
                        <div class="col">
                            <FieldText
                                name="reference"
                                label="Referencia"
                                min="2"
                                max="250"
                                bind:value={value.reference}
                                errors={inputErrors.get("reference")}
                                oninput={() => validateField("reference")}
                            />
                            <FieldText
                                name="voucher"
                                label="Comprobante"
                                min="2"
                                max="250"
                                bind:value={value.voucher}
                                errors={inputErrors.get("voucher")}
                                oninput={() => validateField("voucher")}
                            />
                            <SelectField
                                name="accountId"
                                label="Cuentas"
                                onchange={(e) => {
                                    value.accountId = parseFloat(
                                        e.currentTarget.value,
                                    );
                                    if (!accounts.has(value.accountId)) {
                                        inputErrors.set("accountId", [
                                            "El id de la cuenta no es valido.",
                                        ]);
                                        return;
                                    }
                                    validateField("accountId");
                                }}
                                errors={inputErrors.get("accountId")}
                                options={accounts
                                    .entries()
                                    .map(([id, { code, name }]) => ({
                                        value: id,
                                        text: `${code} | ${name}`,
                                    }))
                                    .toArray()}
                            />
                            <FieldText
                                name="debit"
                                label="Debito"
                                type="number"
                                min="0.00"
                                step="0.01"
                                bind:value={
                                    () => value.debit,
                                    (v) => {
                                        value.debit = v;
                                        value.credit = v === 0 ? 1 : 0;
                                    }
                                }
                                errors={inputErrors.get("debit")}
                                oninput={() => validateField("debit")}
                            />
                            <FieldText
                                name="credit"
                                label="Credito"
                                type="number"
                                min="0.00"
                                step="0.01"
                                bind:value={
                                    () => value.credit,
                                    (v) => {
                                        value.credit = v;
                                        value.debit = v === 0 ? 1 : 0;
                                    }
                                }
                                errors={inputErrors.get("credit")}
                                oninput={() => validateField("credit")}
                            />
                            <button class="btn btn-primary w-100"
                                >Agregar</button
                            >
                            <pre>
                                {JSON.stringify(value, null, 2)}
                                {JSON.stringify(indexToEdit, null, 2)}
                            </pre>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
