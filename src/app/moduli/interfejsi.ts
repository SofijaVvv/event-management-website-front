export interface ItemKomitent {
    id: number
    naziv: string
    pib?: string
    pdvbroj?: string
    adresa?: string
    telefon?: string
    email?: string
    ziroracun?: string
    drzava: number
    grad?: string
    napomena?: string
    vrstakomitenta_id: number
}


export interface ItemSifrarnik {
    id: number
    naziv: string
}


export interface ItemZadatak {
    id: number
    dogadjaj_id: number
    datum: string
    status: number
    opis: string
}



export interface ItemDogadjaj {
    id: number
    datum: string
    vrijeme: string
    komitent_id: number
    vrstadogadjaja_id: number
    iznos: number
    opis: string
    statusdogadjaja_id: number
}


export interface ItemPrihodi {
    id: number
    dogadjaj_id: number
    datum: string
    opis: string
    iznos: number
}


export interface ItemRaspored {
    id: number
    dogadjaj_id: number
    datum: string
    opis: string
}



export interface ItemTroskovi {
    id: number
    dogadjaj_id: number
    datum: string
    opis: string
    iznos: number
    vrstatroska_id: number
}

export interface ItemStavkeKalendara {
    datum: string
    brojdogadjaja: number
    danunedjelji: number
}
