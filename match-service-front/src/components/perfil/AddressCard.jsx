import ProfileField from "./ProfileField";
import { BR_STATES } from "../../data/profile";

export default function AddressCard({ values, errors, editing, onChange }) {
  const disabled = !editing;
  return (
    <section
      aria-labelledby="address-title"
      className="rounded-[20px] border border-hairline bg-surface-1 p-5 xl:p-4"
    >
      <h2 id="address-title" className="font-display text-lg font-semibold text-cream xl:text-base">
        Endereço
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3 xl:mt-3">
        <ProfileField
          id="profile-cep"
          label="CEP"
          inputMode="numeric"
          autoComplete="off"
          placeholder="00000-000"
          value={values.cep}
          onChange={(e) => onChange("cep", e.target.value)}
          disabled={disabled}
          error={errors.cep}
        />
        <ProfileField
          id="profile-number"
          label="Número"
          autoComplete="off"
          value={values.number}
          onChange={(e) => onChange("number", e.target.value)}
          disabled={disabled}
          error={errors.number}
        />
        <div className="col-span-2">
          <ProfileField
            id="profile-street"
            label="Logradouro"
            autoComplete="off"
            value={values.street}
            onChange={(e) => onChange("street", e.target.value)}
            disabled={disabled}
            error={errors.street}
          />
        </div>
        <ProfileField
          id="profile-complement"
          label="Complemento (opcional)"
          autoComplete="off"
          value={values.complement}
          onChange={(e) => onChange("complement", e.target.value)}
          disabled={disabled}
          error={errors.complement}
        />
        <ProfileField
          id="profile-district"
          label="Bairro"
          autoComplete="off"
          value={values.district}
          onChange={(e) => onChange("district", e.target.value)}
          disabled={disabled}
          error={errors.district}
        />
        <ProfileField
          id="profile-city"
          label="Cidade"
          autoComplete="off"
          value={values.city}
          onChange={(e) => onChange("city", e.target.value)}
          disabled={disabled}
          error={errors.city}
        />
        <ProfileField
          as="select"
          id="profile-state"
          label="Estado"
          value={values.state}
          onChange={(e) => onChange("state", e.target.value)}
          disabled={disabled}
          error={errors.state}
        >
          <option value="">Selecione</option>
          {BR_STATES.map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </ProfileField>
      </div>
    </section>
  );
}
