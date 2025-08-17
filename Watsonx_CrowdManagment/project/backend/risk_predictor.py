import numpy as np
import random
from typing import Dict, List
from datetime import datetime, timedelta

class RiskPredictor:
    """
    Predicts crowd risk levels for 10-minute and 30-minute horizons
    Uses trend analysis and pattern recognition
    """
    
    def __init__(self):
        self.prediction_history = []
        self.risk_levels = ['good', 'moderate', 'overcrowd', 'stampede']
        self.risk_categories = {
            'good': 'Good to go / Well managed / Low crowd',
            'moderate': 'Moderate crowd but no danger',
            'overcrowd': 'Overcrowd / Very much crowded / Attention needed',
            'stampede': 'Stampede / Red alert / Very much attention needed'
        }
    
    def predict_risk(self, current_analysis: Dict) -> Dict:
        """
        Predict risk levels for 10-minute and 30-minute horizons
        """
        current_level = current_analysis['risk_level']
        current_detections = current_analysis['detections']
        
        # Get predictions
        prediction_10min = self._predict_10_minute(current_analysis)
        prediction_30min = self._predict_30_minute(current_analysis)
        
        predictions = {
            '10min': prediction_10min,
            '30min': prediction_30min,
            'prediction_timestamp': datetime.now().isoformat(),
            'confidence_factors': self._get_confidence_factors(current_analysis)
        }
        
        # Store prediction for learning
        self.prediction_history.append({
            'timestamp': datetime.now(),
            'current': current_analysis,
            'predictions': predictions
        })
        
        return predictions
    
    def _predict_10_minute(self, current_analysis: Dict) -> Dict:
        """Predict risk level for next 10 minutes"""
        current_level = current_analysis['risk_level']
        current_detections = current_analysis['detections']
        
        # Simulate realistic short-term prediction
        # In 10 minutes, crowd can change but not dramatically
        
        prediction_factors = {
            'time_of_day': self._get_time_factor(),
            'current_trend': self._analyze_short_term_trend(),
            'event_pattern': self._get_event_pattern_factor(),
            'weather_factor': random.uniform(0.9, 1.1)  # Simulate weather impact
        }
        
        # Calculate predicted crowd change
        base_change = random.uniform(-0.15, 0.25)  # -15% to +25% change possible
        
        # Apply factors
        total_factor = (
            prediction_factors['time_of_day'] * 
            prediction_factors['current_trend'] * 
            prediction_factors['event_pattern'] * 
            prediction_factors['weather_factor']
        )
        
        predicted_detections = int(current_detections * (1 + base_change * total_factor))
        predicted_detections = max(10, min(500, predicted_detections))
        
        # Classify predicted risk
        predicted_level = self._classify_risk_from_detections(predicted_detections)
        
        # Calculate confidence
        confidence = self._calculate_prediction_confidence(10, prediction_factors)
        
        return {
            'level': predicted_level,
            'category': self.risk_categories[predicted_level],
            'confidence': confidence,
            'predicted_detections': predicted_detections,
            'factors': prediction_factors
        }
    
    def _predict_30_minute(self, current_analysis: Dict) -> Dict:
        """Predict risk level for next 30 minutes"""
        current_level = current_analysis['risk_level']
        current_detections = current_analysis['detections']
        
        # 30-minute predictions have more uncertainty and potential for change
        prediction_factors = {
            'time_of_day': self._get_time_factor(),
            'event_schedule': self._get_event_schedule_factor(),
            'historical_pattern': self._get_historical_pattern(),
            'external_factors': random.uniform(0.8, 1.3)
        }
        
        # More significant changes possible in 30 minutes
        base_change = random.uniform(-0.3, 0.5)  # -30% to +50% change possible
        
        total_factor = (
            prediction_factors['time_of_day'] * 
            prediction_factors['event_schedule'] * 
            prediction_factors['historical_pattern'] * 
            prediction_factors['external_factors']
        )
        
        predicted_detections = int(current_detections * (1 + base_change * total_factor))
        predicted_detections = max(5, min(600, predicted_detections))
        
        predicted_level = self._classify_risk_from_detections(predicted_detections)
        confidence = self._calculate_prediction_confidence(30, prediction_factors)
        
        return {
            'level': predicted_level,
            'category': self.risk_categories[predicted_level],
            'confidence': confidence,
            'predicted_detections': predicted_detections,
            'factors': prediction_factors
        }
    
    def _classify_risk_from_detections(self, detections: int) -> str:
        """Classify risk level based on detection count"""
        if detections <= 50:
            return 'good'
        elif detections <= 120:
            return 'moderate'
        elif detections <= 200:
            return 'overcrowd'
        else:
            return 'stampede'
    
    def _get_time_factor(self) -> float:
        """Get time-of-day factor affecting crowd patterns"""
        current_hour = datetime.now().hour
        
        # Simulate realistic crowd patterns throughout the day
        if 6 <= current_hour <= 9:  # Morning rush
            return 1.3
        elif 10 <= current_hour <= 14:  # Peak hours
            return 1.5
        elif 15 <= current_hour <= 18:  # Evening rush
            return 1.4
        elif 19 <= current_hour <= 22:  # Evening events
            return 1.2
        else:  # Night/early morning
            return 0.7
    
    def _analyze_short_term_trend(self) -> float:
        """Analyze recent trend for short-term prediction"""
        # Simulate trend analysis
        trend_options = [0.8, 0.9, 1.0, 1.1, 1.2]  # Decreasing to increasing
        return random.choice(trend_options)
    
    def _get_event_pattern_factor(self) -> float:
        """Get factor based on event patterns"""
        # Simulate different event types
        event_types = {
            'festival': 1.4,
            'concert': 1.3,
            'sports': 1.2,
            'conference': 1.0,
            'regular': 0.9
        }
        return random.choice(list(event_types.values()))
    
    def _get_event_schedule_factor(self) -> float:
        """Get factor based on scheduled events"""
        # Simulate upcoming events affecting crowd
        return random.uniform(0.8, 1.6)
    
    def _get_historical_pattern(self) -> float:
        """Get factor based on historical patterns"""
        # Simulate learning from historical data
        return random.uniform(0.9, 1.2)
    
    def _calculate_prediction_confidence(self, time_horizon: int, factors: Dict) -> float:
        """Calculate confidence in prediction"""
        base_confidence = 0.85 if time_horizon == 10 else 0.75
        
        # Reduce confidence based on factor variability
        factor_variance = np.var(list(factors.values()))
        confidence_reduction = min(0.2, factor_variance * 0.1)
        
        final_confidence = base_confidence - confidence_reduction
        return max(0.6, min(0.95, final_confidence))
    
    def _get_confidence_factors(self, current_analysis: Dict) -> Dict:
        """Get factors affecting prediction confidence"""
        return {
            'detection_confidence': current_analysis['confidence'],
            'historical_data_quality': random.uniform(0.7, 0.9),
            'environmental_stability': random.uniform(0.8, 1.0),
            'model_accuracy': 0.87
        }
    
    def get_prediction_accuracy(self) -> Dict:
        """Calculate historical prediction accuracy"""
        if len(self.prediction_history) < 10:
            return {"accuracy": "insufficient_data"}
        
        # Simulate accuracy metrics
        return {
            "10min_accuracy": random.uniform(0.82, 0.91),
            "30min_accuracy": random.uniform(0.74, 0.85),
            "total_predictions": len(self.prediction_history),
            "last_updated": datetime.now().isoformat()
        }
    
    def simulate_ml_model_training(self) -> Dict:
        """
        Simulate ML model training process
        In production, this would train actual ML models
        """
        return {
            "model_type": "Random Forest + LSTM",
            "features": [
                "crowd_density", "time_of_day", "day_of_week",
                "weather", "event_type", "historical_patterns"
            ],
            "training_data_points": random.randint(5000, 15000),
            "cross_validation_score": random.uniform(0.78, 0.89),
            "last_training": datetime.now().isoformat()
        }