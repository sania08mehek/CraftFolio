"""
CraftFolio Backend — Pydantic v2 Models
"""
from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, Field


class Project(BaseModel):
    name: str
    description: str
    link: Optional[str] = None
    tech_stack: list[str] = Field(default_factory=list)


class Certification(BaseModel):
    name: str
    issuer: str
    year: str
    link: Optional[str] = None


class UserData(BaseModel):
    name: str
    title: str
    bio: str
    github: Optional[str] = None
    linkedin: Optional[str] = None
    contact_email: Optional[str] = None
    profile_image: Optional[str] = None
    skills: list[str] = Field(default_factory=list)
    projects: list[Project] = Field(default_factory=list)
    certifications: list[Certification] = Field(default_factory=list)


class Customization(BaseModel):
    theme: str = "Midnight"
    sections_order: list[str] = Field(
        default=["hero", "about", "skills", "projects", "certifications", "contact"]
    )
    excluded_sections: list[str] = Field(default_factory=list)
    section_layouts: dict[str, int] = Field(
        default_factory=lambda: {
            "navbar": 1, "hero": 1, "about": 1,
            "skills": 1, "projects": 1, "certifications": 1, "contact": 1,
        }
    )


class GenerateRequest(BaseModel):
    customization: Customization
    userData: UserData


class GenerateResponse(BaseModel):
    html: str
