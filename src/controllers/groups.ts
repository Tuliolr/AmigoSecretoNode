import { RequestHandler } from "express";
import * as groups from '../services/groups';
import { z } from "zod";

export const getAll: RequestHandler = async (req, res) => {
    const { id_event } =  req.params;

    const items = await groups.getAll(parseInt(id_event));
    if(items) {
        res.json({groups: items});
        return;
    }

    res.json({ error: 'Ocorreu um erro'});
}

export const getGroup: RequestHandler = async (req, res) => {
    const { id, id_event } = req.params;

    const groupItem = await groups.getOne({
        id: parseInt(id),
        id_event: parseInt(id_event) 
    });
    if(groupItem) {
        res.json({ group: groupItem});
        return;
    }

    res.json({ error: 'Ocorreu um erro'});
}

export const addGroup: RequestHandler = async (req, res) => {
    const { id_event } = req.params;

    const addGroupSchema = z.object({
        name: z.string()
    });
    const body = addGroupSchema.safeParse(req.body);
    if(!body.success) {
        res.json({ error: 'Dados invalidos'});
        return;
    }

    const newGroup = await groups.add({
        name: body.data.name,
        id_event: parseInt(id_event)
    });

    if(newGroup) {
        res.status(201).json({group: newGroup});
        return;
    }

    res.json({ error: 'Ocorreu um erro'});
}

export const updateGroup: RequestHandler = async (req, res) => {
    const { id, id_event } = req.params;

    const updateGroupSchema = z.object({
        name: z.string().optional()
    });

    const body = updateGroupSchema.safeParse(req.body);
    if(!body.success) {
        res.json({ error: 'Dados invalidos'});
        return;
    }

    const updateGroup = await groups.update({
        id: parseInt(id),
        id_event: parseInt(id_event)
    }, body.data);
    if(updateGroup) {
        res.json({group: updateGroup});
        return;
    }

    res.json({ error: 'Ocorreu um erro'});
}

export const deleteGroup: RequestHandler = async (req, res) => {
    const { id, id_event } = req.params;

    const deleteGroup = await groups.remove({
        id: parseInt(id),
        id_event: parseInt(id_event)
    });
    if(deleteGroup) {
        res.json({ group: deleteGroup});
        return;
    }

    res.json({ error: 'Ocorreu um erro'});
}