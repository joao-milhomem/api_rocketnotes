const knex = require("../database/knex");

class NotesController {
  async create(request, response) {
    const { title, description, tags, links } = request.body;
    const user_id  = request.user.id;

    const note_id = await knex("notes").insert({
      title,
      description,
      user_id,
    });

    const linksToInsert = links.map((link) => {
      return {
        note_id,
        url: link,
      };
    });

    await knex("links").insert(linksToInsert);

    const tagsToInsert = tags.map((name) => {
      return {
        note_id,
        name,
        user_id,
      };
    });

    await knex("tags").insert(tagsToInsert);

    return response.json({});
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("notes").where({ id }).first();

    const tags = await knex("tags").where({ note_id: id }).orderBy("name");

    const links = await knex("links")
      .where({ note_id: id })
      .orderBy("created_at");

    return response.json({
      ...note,
      tags,
      links,
    });
  }

  async index(request, response) {
    const { title, tags } = request.query;
    const user_id  = request.user.id;
    let notes;

    if (tags) {
      const searchedTags = tags.split(",").map((tag) => tag.trim());
      notes = await knex("tags")
        .select(["notes.id", "notes.title", "notes.user_id"])
        .where("notes.user_id", user_id)
        .whereLike("notes.title", `%${title}%`)
        .whereIn("name", searchedTags)
        .innerJoin("notes", "notes.id", "tags.note_id")
        .orderBy("notes.title");
    } else {
      notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const allUserTags = await knex("tags").where({ user_id });
    const NoteWithTags = notes.map((note) => {
      const filteredTags = allUserTags.filter((tag) => tag.note_id === note.id);

      return {
        ...note,
        tags: filteredTags,
      };
    });

    return response.json(NoteWithTags);
  }

  async delete(request, response) {
    const { id } = request.params;
    await knex("notes").where({ id }).delete();
    return response.json({});
  }
}

module.exports = NotesController;
