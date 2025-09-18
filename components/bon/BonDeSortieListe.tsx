"use client";

import React, { useState } from "react";
import { BonDeSortie } from "./BonDeSortie";

type Props = {
    BonDeSortie: BonDeSortie[];
    setBonDeSortie: React.Dispatch<React.SetStateAction<BonDeSortie[]>>;
    setSelectedBonDeSortie:(bonDeSortie: BonDeSortie) => void;
    setIsEditing: (value : boolean) => void;
};


export default function BonDeSortieListe({
    BonDeSortie,
    setBonDeSortie,
    setSelectedBonDeSortie,
    setIsEditing,
}: Props) {
    const [searchTerm, setSearchTerm] = useState("");
}

