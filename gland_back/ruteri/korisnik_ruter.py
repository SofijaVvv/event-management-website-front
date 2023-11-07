import platform
from datetime import datetime
from typing import Annotated

import psutil
from GPUtil import GPUtil
from fastapi import Depends, APIRouter

from baznimodeli import ItemOperater
from ruteri.login_ruter import get_current_active_user

router = APIRouter()


@router.get("/operater/ja/", response_model=ItemOperater)
async def citaj_operater_ja(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)]
):
    return current_user


@router.get("/operater/ja/items/")
async def citaj_moje_ajteme(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)]
):
    return [{"item_id": "Mujo", "vlasnik": current_user.email}]


def get_size(bajtovi, suffix="B"):
    """
    Scale bajtovi to its proper format
    e.g:
        1253656 => '1.20MB'
        1253656678 => '1.17GB'
    """
    factor = 1024
    for unit in ["", "K", "M", "G", "T", "P"]:
        if bajtovi < factor:
            return f"{bajtovi:.2f}{unit}{suffix}"
        bajtovi /= factor


@router.get("/sistem")
def citaj_sistem():
    rezultat = []
    print("=" * 40, "System Information", "=" * 40)
    # uname = platform.uname()
    #
    # boot_time_timestamp = psutil.boot_time()
    # bt = datetime.fromtimestamp(boot_time_timestamp)
    # procesorsko_vrijeme = []
    # for i, percentage in enumerate(psutil.cpu_percent(percpu=True, interval=1)):
    #     procesorsko_vrijeme.append(percentage)
    #
    # cpufreq = psutil.cpu_freq()
    #

    swap = psutil.virtual_memory()
    glavna = psutil.swap_memory()


    # partitions = psutil.disk_partitions()
    # diskovi = []
    # for partition in partitions:
    #
    #
    #     try:
    #         partition_usage = psutil.disk_usage(partition.mountpoint)
    #     except PermissionError:
    #         # this can be catched due to the disk that
    #         # isn't ready
    #         continue
    #     print(partition_usage)
    #     tmp = {
    #         "device": partition.device,
    #         "mountpoint": partition.mountpoint,
    #         "fstype": partition.fstype,
    #         "usage_total": get_size(partition_usage.total),
    #         "usage_used": get_size(partition_usage.used),
    #         "usage_free": get_size(partition_usage.free),
    #         "procenat": partition_usage.percent
    #     }
    #     diskovi.append(tmp)
    # get IO statistics since boot

    rezultat = {
        # "sistem": {
        #     "naziv_sistema": uname.system,
        #     "node_name": uname.node,
        #     "release": uname.release,
        #     "version": uname.version,
        #     "boot_time": bt.strftime("%d.%m.%Y %H:%M:%S")
        # },
        # "procesor": {
        #     "broj_procesora": psutil.cpu_count(logical=False),
        #     "cpu_time": procesorsko_vrijeme,
        #     "max_cpu_freq": f"{cpufreq.max:.2f}Mhz"
        # },
        "memorija": {
            "ukupno": get_size(swap.total),
            "used": get_size(swap.used),
            "free": get_size(swap.free),
            "procenat": get_size(swap.percent),

        }


    }
    print(rezultat)
    # if_addrs = psutil.net_if_addrs()
    # for interface_name, interface_addresses in if_addrs.items():
    #     for address in interface_addresses:
    #         if str(address.family) == 'AddressFamily.AF_INET':
    #             rezultat['mreza'] = {
    #                 "ime": interface_name,
    #                 "familija": address.family,
    #                 "adresa": address.address,
    #                 "netmask": address.netmask,
    #                 "broadcast": address.broadcast,
    #             }
    # gpus = GPUtil.getGPUs()
    # list_gpus = []
    # for gpu in gpus:
    #     gpu_data = {
    #         "ime": gpu.name,
    #         "memorija": f"{gpu.memoryTotal}MB",
    #         "memorija_free": f"{gpu.memoryFree}MB",
    #         "memorija_used": f"{gpu.memoryUsed}MB",
    #         "procenat": f"{gpu.memoryUtil*100}%",
    #         "load": f"{gpu.load*100}%",
    #         "temp": f"{gpu.temperature} °C",
    #         "uuid": gpu.uuid
    #     }
    #     list_gpus.append(gpu_data)
    # rezultat['gpu'] = list_gpus
    return rezultat
