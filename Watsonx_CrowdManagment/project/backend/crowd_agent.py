import cv2
import numpy as np
import random
import time
from typing import Dict, List, Tuple

class CrowdAnalyzer:
    """
    Simulates YOLO-based crowd detection and analysis
    In production, this would use actual YOLOv8 model
    """
    
    def __init__(self):
        self.risk_levels = [
            {
                'level': 'good',
                'category': 'Good to go / Well managed / Low crowd',
                'density_range': (0, 50),
                'base_confidence': 0.95
            },
            {
                'level': 'moderate',
                'category': 'Moderate crowd but no danger',
                'density_range': (51, 120),
                'base_confidence': 0.88
            },
            {
                'level': 'overcrowd',
                'category': 'Overcrowd / Very much crowded / Attention needed',
                'density_range': (121, 200),
                'base_confidence': 0.82
            },
            {
                'level': 'stampede',
                'category': 'Stampede / Red alert / Very much attention needed',
                'density_range': (201, 500),
                'base_confidence': 0.91
            }
        ]
        
        self.frame_history = []
        self.detection_history = []
    
    def analyze_frame(self, frame_number: int) -> Dict:
        """
        Simulate YOLO detection on a frame
        Returns crowd analysis with risk classification
        """
        
        # Simulate crowd detection count (would be actual YOLO detections)
        base_crowd = 80 + (frame_number % 50) * 2
        noise = random.randint(-20, 30)
        crowd_count = max(10, base_crowd + noise)
        
        # Add some realistic patterns
        if frame_number > 30:  # Simulate crowd building up
            crowd_count += min(frame_number - 30, 100)
        
        if frame_number > 70:  # Simulate potential overcrowding
            crowd_count += random.randint(0, 80)
        
        # Classify risk level based on crowd density
        risk_info = self._classify_risk(crowd_count)
        
        # Generate bounding boxes (simulate YOLO detections)
        bounding_boxes = self._generate_bounding_boxes(crowd_count)
        
        # Calculate confidence based on detection quality
        confidence = self._calculate_confidence(crowd_count, risk_info)
        
        analysis = {
            'frame_number': frame_number,
            'detections': crowd_count,
            'risk_level': risk_info['level'],
            'category': risk_info['category'],
            'confidence': confidence,
            'bounding_boxes': bounding_boxes,
            'timestamp': time.time(),
            'density_per_sqm': round(crowd_count / 100, 2)  # Assuming 100 sqm area
        }
        
        # Store in history for trend analysis
        self.detection_history.append(analysis)
        if len(self.detection_history) > 50:
            self.detection_history.pop(0)
        
        return analysis
    
    def _classify_risk(self, crowd_count: int) -> Dict:
        """Classify crowd count into risk categories"""
        for risk in self.risk_levels:
            min_density, max_density = risk['density_range']
            if min_density <= crowd_count <= max_density:
                return risk
        
        # If exceeds highest category, return stampede
        return self.risk_levels[-1]
    
    def _generate_bounding_boxes(self, crowd_count: int) -> List[Dict]:
        """Generate simulated bounding boxes for detected persons"""
        boxes = []
        
        # Simulate realistic distribution of people in frame
        for i in range(min(crowd_count, 50)):  # Limit visual boxes for performance
            box = {
                'id': f'person_{i}',
                'x': random.uniform(0.1, 0.9),  # Normalized coordinates
                'y': random.uniform(0.2, 0.8),
                'width': random.uniform(0.03, 0.08),
                'height': random.uniform(0.08, 0.15),
                'confidence': random.uniform(0.7, 0.98),
                'class': 'person'
            }
            boxes.append(box)
        
        return boxes
    
    def _calculate_confidence(self, crowd_count: int, risk_info: Dict) -> float:
        """Calculate detection confidence based on crowd density and conditions"""
        base_confidence = risk_info['base_confidence']
        
        # Adjust confidence based on crowd density
        if crowd_count < 30:
            confidence_modifier = 0.05  # Higher confidence for low crowds
        elif crowd_count > 200:
            confidence_modifier = -0.08  # Lower confidence for very dense crowds
        else:
            confidence_modifier = 0.0
        
        # Add some randomness to simulate real-world conditions
        noise = random.uniform(-0.03, 0.03)
        
        final_confidence = base_confidence + confidence_modifier + noise
        return max(0.6, min(0.99, final_confidence))
    
    def get_trend_analysis(self) -> Dict:
        """Analyze crowd trends from recent history"""
        if len(self.detection_history) < 5:
            return {"trend": "insufficient_data"}
        
        recent_detections = [h['detections'] for h in self.detection_history[-10:]]
        
        # Calculate trend
        if len(recent_detections) >= 2:
            trend_slope = (recent_detections[-1] - recent_detections[0]) / len(recent_detections)
            
            if trend_slope > 5:
                trend = "increasing"
            elif trend_slope < -5:
                trend = "decreasing"
            else:
                trend = "stable"
        else:
            trend = "stable"
        
        return {
            "trend": trend,
            "recent_average": np.mean(recent_detections),
            "recent_max": max(recent_detections),
            "recent_min": min(recent_detections),
            "volatility": np.std(recent_detections)
        }
    
    def simulate_yolo_processing(self, video_path: str = None) -> Dict:
        """
        Simulate YOLO model processing
        In production, this would load and run actual YOLOv8 model
        """
        processing_info = {
            "model": "YOLOv8n",
            "input_size": "640x640",
            "classes": ["person"],
            "processing_time": random.uniform(0.05, 0.15),  # Seconds per frame
            "gpu_acceleration": True,
            "confidence_threshold": 0.5,
            "nms_threshold": 0.4
        }
        
        return processing_info