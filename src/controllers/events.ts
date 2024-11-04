import { RequestHandler } from "express";
import * as events from '../services/events';
import * as people from '../services/people';
import { z } from "zod";

export const getAll: RequestHandler = async (req, res) => {
    const items = await events.getAll();
    if(items) {
        res.json({ events: items});
        return;
    }

    res.json({ error: 'Ocorreu um erro'});
}

export const getEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const eventItem = await  events.getOne(parseInt(id));
    if(eventItem) {
        res.json({ event: eventItem});
        return;
    }

    res.json({ error: 'Ocorreu um erro'});
}

export const addEvent: RequestHandler = async (req, res) => {
    const addEventSchema = z.object({
        title: z.string(),
        description: z.string(),
        grouped: z.boolean()
    });
    const body = addEventSchema.safeParse(req.body);
    if(!body.success) {
        res.json({ error: 'Dados invalidos'});
        return;
    }

    const newEvent = await events.add(body.data);
    if(newEvent) {
        res.status(201).json({event: newEvent})
        return;
    }

    res.json({ error: 'Ocorreu um erro'});
}

export const updateEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const updateEventSchema = z.object({
        status: z.boolean().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        grouped: z.boolean().optional()
    });
    const body = updateEventSchema.safeParse(req.body);
    if(!body.success) {
        res.json({ error:'Dados invalidos'});
        return;
    }

    const updateEvent = await events.update(parseInt(id), body.data);
    if(updateEvent) {
        if(updateEvent.status) {
            const result = await events.doMatches(parseInt(id));
            if (!result) {
                res.json({ error: 'Grupos impossiveis de sortear'})
                return;
            }
        } else {
            await people.update({id_event: parseInt(id)}, {matched: ''});
        }
        res.json({ event: updateEvent});
        return;
    }

    res.json({ error: 'Ocorreu um erro'});
}

export const deleteEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const deletedEvent = await events.remove(parseInt(id));
    if (deleteEvent) {
        res.json({ event: deleteEvent});
        return;
    }

    res.json({ error: 'Ocorreu um erro'});
}