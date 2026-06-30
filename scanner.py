import socket
from datetime import datetime

TARGET_HOST = "127.0.0.1" 
PORTS_TO_CHECK = [22, 80, 443]

def run_local_check():
    print(f"Starting local port check on {TARGET_HOST}...")
    print(f"Time started: {datetime.now()}\n")
    
    report_results = []

    for port in PORTS_TO_CHECK:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1.0)
        result = s.connect_ex((TARGET_HOST, port))
        
        if result == 0:
            status = "OPEN"
            notes = "Service is listening. Ensure it is updated and properly configured."
        else:
            status = "CLOSED or FILTERED"
            notes = "No active service detected responding on this port."
            
        s.close()
        
        report_results.append({
            "port": port,
            "status": status,
            "notes": notes
        })
        print(f"Port {port}: {status}")

    generate_report(report_results)

def generate_report(results):
    filename = "local_scan_report.txt"
    with open(filename, "w") as report_file:
        report_file.write("=== VULNERABILITY ASSESSMENT REPORT (CONCEPT) ===\n")
        report_file.write(f"Target: {TARGET_HOST}\n")
        report_file.write(f"Date: {datetime.now()}\n")
        report_file.write("-" * 50 + "\n\n")
        
        for item in results:
            report_file.write(f"Port: {item['port']}\n")
            report_file.write(f"Status: {item['status']}\n")
            report_file.write(f"Recommendation: {item['notes']}\n")
            report_file.write("-" * 30 + "\n")
            
    print(f"\n[+] Report successfully saved to '{filename}'")

if __name__ == "__main__":
    run_local_check()