<script lang="ts">
    import FieldText from "@/components/FieldText.svelte";
    import RecordsGrud from "./RecordsGrud.svelte";
    import { journalCodeFormatter } from "@/lib/helpers/journal";
    import Form from "@/components/atoms/Form.svelte";
    import { formValidator } from "@/lib/helpers/formValidator.svelte";
    import { createJournalEntrySchema } from "@/lib/schemas/journal_entry.schema";
    import { systemDateFormatter } from "@/lib/helpers/format";
    import Alert from "@/components/Alert.svelte";
    import { actions } from "astro:actions";

    let { lastJournalCode }: { lastJournalCode: number } = $props();
    let thisDate = new Date(Date.now());

    let {
        form,
        inputErrors,
        value,
        validateAll,
        validateField,
        setFieldError,
    } = formValidator(createJournalEntrySchema, {
        records: [],
        date: systemDateFormatter.formatInput(thisDate),
    });

    let recordErrors = $derived(inputErrors.get("records"));

    let submitError = $state<string | null>(null);
    let submitCode = $state<string | null>(null);

    function setRecordError(error: string) {
        setFieldError("records", error);
    }

    async function submitForm(
        e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
    ) {
        e.preventDefault();
        const parseData = validateAll();
        if (!parseData || form.hasErrors) return;
        const { data, error } = await actions.journalEntry.create(parseData);
        if (error) {
            submitError = `Codigo: ${error.code}, Mensaje: ${error.message}`;
            submitCode = null;
            return;
        }
        submitError = null;
        submitCode = data.code;
    }
</script>

<Form onsubmit={submitForm} id="journal-form">
    <div class="row">
        {#if submitError || submitCode}
            <Alert type={submitError ? "danger" : "success"}>
                {submitError ?? submitCode}
            </Alert>
        {/if}
        <div class="col-12 col-md-6">
            <FieldText
                label="Nombre"
                type="text"
                name="name"
                min="2"
                max="250"
                required
                bind:value={value.name}
                oninput={() => validateField("name")}
                errors={inputErrors.get("name")}
            />
            <FieldText
                label="Descripción"
                type="text"
                name="description"
                min="2"
                max="250"
                required
                bind:value={value.description}
                oninput={() => validateField("description")}
                errors={inputErrors.get("description")}
            />
        </div>
        <div class="col-12 col-md-6">
            <FieldText
                label="Código"
                type="text"
                readonly
                disabled
                value={journalCodeFormatter.format(
                    lastJournalCode,
                    thisDate.getFullYear(),
                )}
            />
            <FieldText
                label="Fecha"
                type="date"
                name="date"
                required
                bind:value={value.date}
                errors={inputErrors.get("date")}
            />
        </div>
    </div>
    <RecordsGrud
        bind:records={value.records}
        validateRecordField={() => validateField("records")}
        {setRecordError}
    />
    {#if recordErrors}
        <Alert type="danger">
            <ul class="mb-0">
                {#each recordErrors as text}
                    <li>{text}</li>
                {/each}
            </ul>
        </Alert>
    {/if}
    <pre>
        {JSON.stringify({ form, value }, null, 2)}
    </pre>
    <div class="row">
        <div class="d-grid">
            <button
                disabled={form.hasErrors}
                type="submit"
                form="journal-form"
                class="btn btn-success mx-auto"
                style="width: 35%;">Registrar</button
            >
        </div>
    </div>
</Form>
