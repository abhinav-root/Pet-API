import xlsx from "xlsx";
import Pet from "./models/Pet.model.js";

export async function addPets(req, res) {
  try {
    let path = req.file.path;
    var workbook = xlsx.readFile(path);
    console.log({ workbook });
    var sheet_name_list = workbook.SheetNames;
    console.log({ sheet_name_list });
    let jsonData = xlsx.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]]
    );
    console.log(jsonData);
    if (jsonData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "xml sheet has no data",
      });
    }

    let pets = [];
    for (const pet of jsonData) {
      pets.push(
        new Pet({
          name: pet.Name,
          type: pet.Type,
          breed: pet.Breed,
          age: pet.Age,
        })
      );
    }

    await Pet.bulkSave(pets);

    return res.status(201).json({
      success: true,
      message: pets.length + " rows added to the database",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
