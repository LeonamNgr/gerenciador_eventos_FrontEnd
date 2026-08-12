export function formatarData(data) {

    if (!data) {
        return "Data não informada";
    }

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;
}

export function formatarHora(hora) {

    if (!hora) {
        return "Horário não informado";
    }

    return hora.substring(0, 5);
}