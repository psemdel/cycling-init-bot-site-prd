# -*- coding: utf-8 -*-

from .dic import routine_to_model

def save_log(rq_id, routine, add_txt, **kwargs):
    table=routine_to_model(routine)
    rq=table.objects.get(pk=rq_id)
    
    display=kwargs.get('display',True)
    if display:
        print(add_txt)
    
    log_old=rq.log
    log_new=log_old + "\n"+ add_txt
    rq.log=log_new
    
    rq.save()
    