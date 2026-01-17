# WhatsApp AI Assistant for Small Businesses

## Overview

Small and local businesses rely heavily on WhatsApp to communicate with customers, but many lose potential customers due to delayed responses, missed messages, or lack of availability outside business hours.

This project builds a **WhatsApp-based AI assistant** that automatically responds to customer messages, answers common questions, maintains conversation context, and escalates conversations to a human when necessary. The system is designed to be **multi-tenant**, scalable, and suitable for real-world business use.

The AI logic is built from scratch using **LangGraph (TypeScript)**, while WhatsApp integration is handled through webhook-based APIs (e.g., Twilio or Meta WhatsApp Cloud API).

---

## Problem Statement

Small businesses often:
- Miss customer messages
- Respond too late to inquiries
- Lose bookings and leads
- Spend excessive time managing WhatsApp conversations

There is a need for an automated yet controlled system that can handle customer conversations efficiently without fully replacing human oversight.

---

## Solution

This project provides an **AI-powered WhatsApp chatbot** that:
- Responds instantly to incoming messages
- Answers frequently asked questions (FAQs)
- Maintains conversational context
- Collects booking or inquiry details
- Escalates complex cases to a human
- Supports multiple businesses using a single webhook

---

## Key Features

- WhatsApp integration via webhook-based APIs  
- Custom AI agent built with **LangGraph (TypeScript)**  
- Conversation memory for context-aware responses  
- Multi-tenant architecture (one webhook, many businesses)  
- Human-in-the-loop support for approvals and escalations  
- Extensible design for future integrations (booking, CRM, reviews)

---

## Architecture Overview

```text
WhatsApp (Customer)
        ↓
WhatsApp API (Twilio / Meta)
        ↓
Single Webhook Endpoint
        ↓
Routing Logic (Business Identification)
        ↓
LangGraph AI Agent
        ↓
Response Sent Back to WhatsApp
