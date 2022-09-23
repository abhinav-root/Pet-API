import xlsx from "xlsx";
import Pet from "./models/Pet.model.js";

// Add pets
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

// Get all pets
export async function getAllPets(req, res) {
  const pets = await Pet.find();
  return res.status(200).json({ success: true, data: { pets } });
}

// Get pet by ID
export async function getPetById(req, res) {
  try {
    const petId = req.params.petId;
    const pet = await Pet.findById(petId);
    console.log({ pet });
    if (!pet) {
      return res
        .status(404)
        .json({ success: false, message: `No pet found with id ${petId}` });
    }

    return res.json({ success: true, data: { pet } });
  } catch (err) {
    return res.status(500).json(err);
  }
}

// Update pet by Id
export async function updatePetById(req, res) {
  try {
    const payload = req.body;
    const petId = req.params.petId;
    const pet = await Pet.findByIdAndUpdate(petId, payload, {
      returnDocument: "after",
    });
    if (!pet) {
      return res
        .status(404)
        .json({ success: false, message: `No pet found with id ${petId}` });
    }
    return res.json({ success: true, data: { pet } });
  } catch (err) {
    return res.status(500).json(err);
  }
}

export async function deleteById(req, res) {
  try {
    const payload = req.body;
    const petId = req.params.petId;
    const pet = await Pet.findByIdAndDelete(petId);
    if (!pet) {
      return res
        .status(404)
        .json({ success: false, message: `No pet found with id ${petId}` });
    }
    return res.json({ success: true, message: "deleted successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
}
