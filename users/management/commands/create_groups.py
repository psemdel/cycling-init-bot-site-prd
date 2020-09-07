#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Mar 31 11:22:42 2020

@author: maxime
"""

from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from bot_requests.models import BotRequest
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help='Create groups for permission management'
    
    def handle(self, *args, **options):
        autocheck_group, created = Group.objects.get_or_create(name='autocheck')
        # Code to add permission to group ???
        ct = ContentType.objects.get_for_model(BotRequest)
        # Now what - Say I want to add 'Can add project' permission to new_group?
        permission_request = Permission.objects.create(
            codename='can_post_requests',
            name='Can post requests',
            content_type=ct,
            )
        
        autocheck_group.permissions.add(permission_request)
        
        permission_run = Permission.objects.create(
            codename='can_run_requests',
            name='Can run requests',
            content_type=ct,
            )
        
        autocheck_group.permissions.add(permission_run)
        print("Created auto check.")

        new_user_group, created = Group.objects.get_or_create(name='new_user')
        new_user_group.permissions.add(permission_request)
        print("Created new users.")
