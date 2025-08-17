import random
from typing import Dict, List
from datetime import datetime

class SafetyActionManager:
    """
    Manages proactive safety measures based on crowd risk levels
    Simulates deployment of officers, barricades, and medical units
    """
    
    def __init__(self):
        self.base_location = [28.6139, 77.2090]  # Sample location (Delhi, India)
        self.deployed_resources = {
            'officers': [],
            'barricades': [],
            'medical': []
        }
        
        # Action templates for each risk level
        self.action_templates = {
            'good': [
                'Monitoring active',
                'Regular patrol schedule',
                'Standard security protocols in place'
            ],
            'moderate': [
                'Increased monitoring',
                'Officer presence enhanced',
                'Crowd flow observation active'
            ],
            'overcrowd': [
                'Deploy more officers',
                'Control entry flow',
                'Activate crowd control measures',
                'Increase surveillance',
                'Prepare emergency protocols'
            ],
            'stampede': [
                'EMERGENCY: Close nearby barricades',
                'Call medical team',
                'Re-route crowd immediately',
                'Establish emergency corridors',
                'Activate full emergency response',
                'Contact emergency services'
            ]
        }
    
    def get_actions(self, risk_level: str) -> Dict:
        """
        Get comprehensive safety actions for given risk level
        """
        actions = self._get_action_list(risk_level)
        officers = self._deploy_officers(risk_level)
        barricades = self._manage_barricades(risk_level)
        medical = self._deploy_medical_units(risk_level)
        
        return {
            'actions': actions,
            'officers': officers,
            'barricades': barricades,
            'medical': medical,
            'timestamp': datetime.now().isoformat(),
            'risk_level': risk_level,
            'total_resources': len(officers) + len(barricades) + len(medical)
        }
    
    def _get_action_list(self, risk_level: str) -> List[str]:
        """Get action items for risk level"""
        base_actions = self.action_templates.get(risk_level, self.action_templates['good'])
        
        # Add dynamic actions based on current conditions
        dynamic_actions = []
        
        if risk_level == 'overcrowd':
            dynamic_actions.extend([
                f'Redirect {random.randint(20, 40)}% of incoming crowd',
                'Open additional exit routes',
                'Increase announcement frequency'
            ])
        elif risk_level == 'stampede':
            dynamic_actions.extend([
                'IMMEDIATE: Stop all entry points',
                'Emergency evacuation protocol ACTIVE',
                'Medical teams on standby',
                f'Emergency services ETA: {random.randint(3, 8)} minutes'
            ])
        
        return base_actions + dynamic_actions
    
    def _deploy_officers(self, risk_level: str) -> List[Dict]:
        """Deploy officers based on risk level"""
        officer_counts = {
            'good': 3,
            'moderate': 5,
            'overcrowd': 8,
            'stampede': 12
        }
        
        count = officer_counts.get(risk_level, 3)
        officers = []
        
        for i in range(count):
            # Generate positions around the base location
            lat_offset = random.uniform(-0.01, 0.01)
            lng_offset = random.uniform(-0.01, 0.01)
            
            status = self._get_officer_status(risk_level)
            
            officer = {
                'id': f'officer-{i+1}',
                'position': [
                    self.base_location[0] + lat_offset,
                    self.base_location[1] + lng_offset
                ],
                'status': status,
                'deployment_time': datetime.now().isoformat(),
                'equipment': self._get_officer_equipment(risk_level),
                'communication_channel': f'Channel-{(i % 3) + 1}'
            }
            officers.append(officer)
        
        return officers
    
    def _get_officer_status(self, risk_level: str) -> str:
        """Get officer status based on risk level"""
        status_map = {
            'good': random.choice(['patrol', 'monitoring']),
            'moderate': random.choice(['monitoring', 'positioned']),
            'overcrowd': random.choice(['deployed', 'crowd_control']),
            'stampede': 'emergency_response'
        }
        return status_map.get(risk_level, 'patrol')
    
    def _get_officer_equipment(self, risk_level: str) -> List[str]:
        """Get equipment list for officers based on risk level"""
        base_equipment = ['radio', 'first_aid']
        
        if risk_level in ['overcrowd', 'stampede']:
            base_equipment.extend(['megaphone', 'barrier_tape'])
        
        if risk_level == 'stampede':
            base_equipment.extend(['emergency_kit', 'crowd_control_gear'])
        
        return base_equipment
    
    def _manage_barricades(self, risk_level: str) -> List[Dict]:
        """Manage barricades based on risk level"""
        barricade_counts = {
            'good': 2,
            'moderate': 3,
            'overcrowd': 5,
            'stampede': 7
        }
        
        count = barricade_counts.get(risk_level, 2)
        barricades = []
        
        for i in range(count):
            lat_offset = random.uniform(-0.008, 0.008)
            lng_offset = random.uniform(-0.008, 0.008)
            
            status = self._get_barricade_status(risk_level)
            
            barricade = {
                'id': f'barricade-{i+1}',
                'position': [
                    self.base_location[0] + lat_offset,
                    self.base_location[1] + lng_offset
                ],
                'status': status,
                'type': random.choice(['portable', 'fixed', 'temporary']),
                'capacity': random.randint(50, 200),
                'last_updated': datetime.now().isoformat()
            }
            barricades.append(barricade)
        
        return barricades
    
    def _get_barricade_status(self, risk_level: str) -> str:
        """Get barricade status based on risk level"""
        if risk_level in ['good', 'moderate']:
            return 'open'
        elif risk_level == 'overcrowd':
            return random.choice(['open', 'controlled', 'partial'])
        else:  # stampede
            return random.choice(['closed', 'emergency_only'])
    
    def _deploy_medical_units(self, risk_level: str) -> List[Dict]:
        """Deploy medical units based on risk level"""
        medical_counts = {
            'good': 1,
            'moderate': 2,
            'overcrowd': 3,
            'stampede': 5
        }
        
        count = medical_counts.get(risk_level, 1)
        medical_units = []
        
        for i in range(count):
            lat_offset = random.uniform(-0.006, 0.006)
            lng_offset = random.uniform(-0.006, 0.006)
            
            status = self._get_medical_status(risk_level)
            
            medical_unit = {
                'id': f'medical-{i+1}',
                'position': [
                    self.base_location[0] + lat_offset,
                    self.base_location[1] + lng_offset
                ],
                'status': status,
                'type': random.choice(['ambulance', 'first_aid_station', 'mobile_unit']),
                'personnel_count': random.randint(2, 6),
                'equipment_level': self._get_medical_equipment_level(risk_level),
                'response_time': f'{random.randint(2, 8)} minutes'
            }
            medical_units.append(medical_unit)
        
        return medical_units
    
    def _get_medical_status(self, risk_level: str) -> str:
        """Get medical unit status based on risk level"""
        status_map = {
            'good': 'standby',
            'moderate': 'ready',
            'overcrowd': 'alert',
            'stampede': 'active'
        }
        return status_map.get(risk_level, 'standby')
    
    def _get_medical_equipment_level(self, risk_level: str) -> str:
        """Get medical equipment level based on risk"""
        if risk_level in ['good', 'moderate']:
            return 'basic'
        elif risk_level == 'overcrowd':
            return 'intermediate'
        else:
            return 'advanced'
    
    def get_resource_summary(self) -> Dict:
        """Get summary of all deployed resources"""
        return {
            'total_officers': len(self.deployed_resources['officers']),
            'total_barricades': len(self.deployed_resources['barricades']),
            'total_medical': len(self.deployed_resources['medical']),
            'deployment_status': 'active',
            'last_updated': datetime.now().isoformat(),
            'coordination_center': 'Emergency Command Center',
            'communication_status': 'all_systems_operational'
        }
    
    def simulate_emergency_protocols(self, risk_level: str) -> Dict:
        """
        Simulate emergency protocol activation
        """
        if risk_level != 'stampede':
            return {"status": "no_emergency_protocols_needed"}
        
        return {
            "emergency_level": "RED ALERT",
            "protocols_activated": [
                "Mass evacuation procedure",
                "Emergency services notification",
                "Media coordination",
                "Family reunification center setup",
                "Traffic management activation"
            ],
            "estimated_evacuation_time": f"{random.randint(15, 45)} minutes",
            "emergency_contacts_notified": True,
            "incident_commander": "Emergency Response Team Leader",
            "status": "ACTIVE"
        }
    
    def get_action_effectiveness(self) -> Dict:
        """
        Simulate tracking of action effectiveness
        """
        return {
            "crowd_flow_improvement": f"{random.randint(15, 35)}%",
            "incident_prevention": f"{random.randint(80, 95)}%",
            "response_time": f"{random.uniform(1.5, 4.2):.1f} minutes",
            "resource_utilization": f"{random.randint(70, 90)}%",
            "public_safety_score": f"{random.uniform(8.2, 9.6):.1f}/10"
        }