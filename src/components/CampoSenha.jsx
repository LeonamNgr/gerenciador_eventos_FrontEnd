import { useState } from "react";

function CampoSenha({
    id,
    name,
    label,
    value,
    onChange,
    autoComplete,
    minLength,
    maxLength,
    required = false,
    disabled = false,
}) {

    const [mostrar, setMostrar] = useState(false);

    return (
        <div className="campo-senha">

            <label htmlFor={id}>
                {label}
            </label>

            <div className="campo-senha-container">

                <input
                    id={id}
                    name={name}
                    type={mostrar ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    minLength={minLength}
                    maxLength={maxLength}
                    required={required}
                    disabled={disabled}
                />

                <button
                    type="button"
                    className="campo-senha-toggle"
                    onClick={() => setMostrar(!mostrar)}
                    disabled={disabled}
                >
                    {mostrar ? "Ocultar" : "Mostrar"}
                </button>

            </div>

        </div>
    );
}

export default CampoSenha;